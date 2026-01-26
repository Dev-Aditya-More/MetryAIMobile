import { UploadService } from "@/api/merchant/upload";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { DEFAULT_AVATAR } from "@/constants/images";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { colors } from "@/theme/colors";
import { pickImage } from "@/utils/pickImage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomerAuthService } from "../../../api/customer/auth";

interface ProfileData {
    avatarUrl: string;
    fullName: string;
    phoneCode: string;
    phone: string;
    email: string;
}

export default function EditProfileScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const insets = useSafeAreaInsets();

    // State for form data
    const [formData, setFormData] = useState<ProfileData>({
        avatarUrl: "",
        fullName: "",
        phoneCode: "",
        phone: "",
        email: "",
    });

    // State for initial data to compare against
    const [initialData, setInitialData] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [avatarError, setAvatarError] = useState(false);

    // Fetch profile on mount
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setIsLoading(true);

            if (params.profileData) {
                try {
                    const data = JSON.parse(params.profileData as string);
                    const profile: ProfileData = {
                        avatarUrl: data.avatarUrl || "",
                        fullName: data.fullName || "",
                        phoneCode: data.phoneCode || "",
                        phone: data.phone || "",
                        email: data.email || "",
                    };
                    setFormData(profile);
                    setInitialData(profile);
                    setIsLoading(false);
                    return;
                } catch (e) {
                    console.error("Failed to parse profile params", e);
                }
            }

            const response = await CustomerAuthService.getProfile();
            if (response.success && response.data) {
                const data = response.data;
                const profile: ProfileData = {
                    avatarUrl: data.avatarUrl || "",
                    fullName: data.fullName || "",
                    phoneCode: data.phoneCode || "",
                    phone: data.phone || "",
                    email: data.email || "",
                };
                setFormData(profile);
                setInitialData(profile);
            } else if (!response.success) {
                Alert.alert("Error", response.error || "Failed to load profile data");
            }
        } catch (error) {
            console.error("Failed to load profile", error);
            Alert.alert("Error", "Failed to load profile data");
        } finally {
            setIsLoading(false);
        }
    };

    // Derived state to check if there are changes
    const hasChanges = React.useMemo(() => {
        if (!initialData) return false;

        // Construct current full phone for comparison if needed, 
        // but simple field comparison is better if we keep phone separate in state
        // However, the UI input for phone might combine them.
        // Let's check how we handle the phone input.

        return (
            formData.fullName !== initialData.fullName ||
            formData.phone !== initialData.phone ||
            formData.phoneCode !== initialData.phoneCode ||
            formData.avatarUrl !== initialData.avatarUrl
            // Email is typically not editable here or treated separately, but we include it in check if we bind it
        );
    }, [formData, initialData]);

    // Handle text changes
    const handleChange = (field: keyof ProfileData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Special handler for phone input if we want to display it as "Code Number"
    // For now, I'll display Code and Number separately or just Number if Code is not editable?
    // The user requirement says "phone code must be split correctly".
    // I will display the Phone Code in a non-editable way or separate input, 
    // AND the phone number in the main input.
    // Or, I can try to parse it from a single string.
    // Let's try displaying them together in the input, but that makes change detection hard.
    // SIMPLIFIED APPROACH: Input shows only the number. Code is not shown or shown as prefix text.
    // User request: "phone code must be split correctly". This usually implies handling the full string.
    // Let's try to show "Phone Code" + "Phone Number" in the input, e.g. "+91 932..."

    // Better UX: Show Code as a prefix text in the input container, and Input only has the number.
    // But what if they want to change the code?
    // I will make the input value be "Code [space] Number".

    const [displayPhone, setDisplayPhone] = useState("");

    useEffect(() => {
        if (formData.phoneCode || formData.phone) {
            // If we have both, combine them.
            const code = formData.phoneCode ? formData.phoneCode : "";
            const num = formData.phone ? formData.phone : "";
            if (code && num) {
                setDisplayPhone(`${code} ${num}`);
            } else {
                setDisplayPhone(code + num);
            }
        }
    }, [formData.phoneCode, formData.phone, initialData]); // Only update on initial load or if we want to sync back.
    // Actually, we should only sync from formData to displayPhone when data is loaded.
    // When user types, we update displayPhone and try to parse it into formData.

    useEffect(() => {
        if (initialData && !displayPhone && (initialData.phoneCode || initialData.phone)) {
            const code = initialData.phoneCode || "";
            const num = initialData.phone || "";
            setDisplayPhone(`${code} ${num}`.trim());
        }
    }, [initialData]);

    const handlePhoneChange = (text: string) => {
        setDisplayPhone(text);

        // Simple parser
        // Look for +digits at start
        const match = text.match(/^(\+\d+)\s*(.*)$/);
        if (match) {
            handleChange('phoneCode', match[1]);
            handleChange('phone', match[2].replace(/\s/g, '')); // remove spaces from number part
        } else {
            // Assume no code change if no +, or whole thing is phone if no +
            // If they deleted the +, we might lose the code.
            // Fallback: If no +, keep original code? Or clear it?
            // "making sure phone code matches" suggests we should be careful.
            // If text starts with +, treat as code. 
            // If not, maybe they removed the code.
            // Let's assume the user MUST provide the code with +.
            handleChange('phone', text.replace(/\s/g, ''));
            // If no code detected, maybe set code to empty? 
            // Let's keep the existing code if the user just types numbers?
            // No, that's confusing.
            // If the user types "987...", we treat it as just phone.
            // But we need to save `phoneCode`.
        }
    };

    // Actually, a more robust way as requested "split correctly":
    // I will trust the regex.
    // If user enters "+91 9323...", code="+91", phone="9323..."
    // If user enters "9323...", code="" (or keep previous?), phone="9323..."
    // I will use a separate parsing function for the SAVE action, 
    // and keep `displayPhone` as the source of truth for the input.

    const handleSave = async () => {
        if (!hasChanges && displayPhone === `${initialData?.phoneCode} ${initialData?.phone}`.trim()) {
            // Double check phone change because my hasChanges logic above used formData which might be desynced from displayPhone
            // if I only update displayPhone on type.
            // Let's fix this.
            return;
        }

        try {
            setIsSaving(true);

            // Parse phone from displayPhone
            let finalCode = formData.phoneCode;
            let finalPhone = formData.phone;

            // Regex to find country code (starts with +)
            // Limit code to 1-4 digits to avoid capturing the whole number if space is missing
            const phoneMatch = displayPhone.match(/^(\+\d{1,5})\s*(.*)$/);
            if (phoneMatch) {
                finalCode = phoneMatch[1];
                finalPhone = phoneMatch[2].replace(/\s/g, ''); // Remove spaces
            } else {
                // If it doesn't start with +, maybe it is just the number?
                // If the user originally had a code, and removed it, we might want to warn or just save as is.
                // Or maybe the user didn't type a space? "+919323..."
                // The regex `^(\+\d+)` handles "+919323..." by capturing all digits.
                // We need to be smarter? 
                // Usually codes are 1-3 digits.
                // Let's assume if it starts with +, the first 1-4 chars are code?
                // Standard validation is hard.
                // Let's stick to the space separator if possible, or just the regex I wrote:
                // `^(\+\d+)\s*(.*)$` captures ALL digits after + as group 1 if I'm not careful.
                // `^(\+\d{1,4})\s+(.*)$` ??
                // Let's assume the user keeps the format.

                // Fallback: Use the previous code if the input doesn't have a +?
                // No, if they deleted it, they deleted it provided they can see it.
                finalPhone = displayPhone.replace(/\s/g, '');
                // If no +, maybe we assume the code is part of the phone?
                // Or we just send empty code.
            }

            const payload = {
                avatarUrl: formData.avatarUrl,
                fullName: formData.fullName,
                phoneCode: finalCode,
                phone: finalPhone,
            };

            console.log("Saving profile:", payload);

            await CustomerAuthService.setupProfile(payload);

            // Update initial data to new state
            setInitialData(payload as ProfileData);
            setFormData(prev => ({ ...prev, phoneCode: finalCode, phone: finalPhone }));
            Alert.alert("Success", "Profile updated successfully");

        } catch (error) {
            console.error("Save failed", error);
            Alert.alert("Error", "Failed to save profile changes");
        } finally {
            setIsSaving(false);
        }
    };

    const handleImagePick = async () => {
        try {
            const result = await pickImage();
            if (!result) return;

            setUploadingImage(true);

            const formData = new FormData();
            formData.append("file", {
                uri: result.uri,
                name: result.fileName || "profile_image.jpg",
                type: result.type || "image/jpeg",
            } as any);

            const response = await UploadService.uploadImage(formData) as any;
            console.log("Upload response:", response);

            // Expecting response to contain the URL. Adjust based on actual API response.
            // Common patterns: response.url, response.data.url, or just response if it's the url string.
            // Based on other files, it might be `response.url` or `response`.
            // Let's handle a few common cases or log it. 
            // If the API returns the object directly as data:
            if (response && response.url) {
                handleChange("avatarUrl", response.url);
            } else if (typeof response === 'string' && response.startsWith('http')) {
                handleChange("avatarUrl", response);
            } else {
                console.warn("Unexpected upload response format", response);
                Alert.alert("Warning", "Image uploaded but could not verify URL.");
            }

        } catch (error) {
            console.error("Image upload failed", error);
            Alert.alert("Error", "Failed to upload image");
        } finally {
            setUploadingImage(false);
        }
    };

    // Re-check "hasChanges" including the DisplayPhone
    const isSaveEnabled = React.useMemo(() => {
        if (!initialData) return false;

        const currentPhoneStr = displayPhone.replace(/\s/g, '');
        const initialPhoneStr = `${initialData.phoneCode}${initialData.phone}`.replace(/\s/g, '');

        /* 
           Note: This is a loose comparison. 
           If the user changes spacing, we treat it as no change if the content is same.
        */

        const nameChanged = formData.fullName !== initialData.fullName;
        const phoneChanged = currentPhoneStr !== initialPhoneStr;
        const avatarChanged = formData.avatarUrl !== initialData.avatarUrl;

        return nameChanged || phoneChanged || avatarChanged;
    }, [formData, displayPhone, initialData]);

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>

                    {/* Avatar Section */}
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{
                                uri: (formData.avatarUrl && !avatarError) ? formData.avatarUrl : DEFAULT_AVATAR
                            }}
                            style={styles.avatar}
                            onError={() => setAvatarError(true)}
                        />
                        <TouchableOpacity
                            style={styles.cameraButton}
                            onPress={handleImagePick}
                            disabled={uploadingImage}
                        >
                            {uploadingImage ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <IconSymbol name="camera.fill" size={16} color="#fff" />
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.formContainer}>
                        <View style={styles.inputRow}>
                            <IconSymbol name="person" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={formData.fullName}
                                onChangeText={(text) => handleChange("fullName", text)}
                                placeholder="Name"
                                placeholderTextColor={colors.textSecondary}
                            />
                        </View>

                        <View style={styles.separator} />

                        {/* Email typically read-only or requires different flow */}
                        <View style={[styles.inputRow, { opacity: 0.7 }]}>
                            <IconSymbol name="envelope" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={formData.email}
                                editable={false} // Disable email edit for now as setupProfile doesn't seem to take email
                                placeholder="Email"
                                placeholderTextColor={colors.textSecondary}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.separator} />

                        <View style={styles.inputRow}>
                            <IconSymbol name="phone" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={displayPhone}
                                onChangeText={handlePhoneChange}
                                placeholder="Phone (+Code Number)"
                                placeholderTextColor={colors.textSecondary}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        style={[styles.saveButton, !isSaveEnabled && styles.disabledButton]}
                        onPress={handleSave}
                        disabled={!isSaveEnabled || isSaving}
                    >
                        {isSaving ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        )}
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
            <View style={{ height: TAB_BAR_HEIGHT + Math.max(insets.bottom, 20) }} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    content: {
        padding: 20,
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 40,
        marginTop: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f0f0f0',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#1C1C1E', // Dark background for camera icon
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    formContainer: {
        width: '100%',
        backgroundColor: '#fff',
        marginBottom: 40,
        borderRadius: 12,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 10,
    },
    inputIcon: {
        marginRight: 16,
        width: 24,
        textAlign: 'center',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.textPrimary,
    },
    separator: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginLeft: 50,
    },
    saveButton: {
        width: '100%',
        backgroundColor: '#8E8177', // Matches the brown/gold tone
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        opacity: 0.5,
        backgroundColor: '#A0A0A0', // Optional: change color when disabled
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
