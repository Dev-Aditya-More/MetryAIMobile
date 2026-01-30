// implement upload file functionality

import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons"; // For upload icon
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BusinessService } from "../../../../api/merchant/business"; // Adjust path if needed

export default function RegisterBusiness() {
    const [step, setStep] = useState(0); // 0: General, 1: Location, 2: About
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        businessName: "",
        website: "",
        location: "",
        rooms: "",
        chairs: "",
        description: "",
        logoUrl: "", // Mocked for now
    });

    const steps = ["General", "Location", "About"];

    const updateFormData = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleNext = () => {
        if (step === 0) {
            if (!formData.businessName) {
                Alert.alert("Required", "Please enter your business name.");
                return;
            }
        } else if (step === 1) {
            if (!formData.location || !formData.rooms || !formData.chairs) {
                Alert.alert("Required", "Please fill in all location details.");
                return;
            }
        }
        setStep((prev) => prev + 1);
    };

    const handleBack = () => {
        if (step === 0) {
            router.back();
        } else {
            setStep((prev) => prev - 1);
        }
    };

    const handleChooseFile = async () => {
        console.log("Implement Upload File Functionality")
    }

    const handleFinish = async () => {
        if (!formData.description) {
            Alert.alert("Required", "Please enter a description.");
            return;
        }

        try {
            setLoading(true);
            Keyboard.dismiss();

            // Convert rooms/chairs to numbers
            const payload = {
                name: formData.businessName,
                logoUrl: formData.logoUrl || "https://via.placeholder.com/150",
                website: formData.website,
                location: formData.location,
                rooms: parseInt(formData.rooms) || 0,
                chairs: parseInt(formData.chairs) || 0,
                description: formData.description,
            };

            const response = await BusinessService.createBusiness(payload);

            if (!response.success) {
                Alert.alert("Error", response.error || "Failed to create business.");
                return;
            }

            Alert.alert("Success", "Business profile created successfully!", [
                { text: "OK", onPress: () => router.replace("/merchant/(home)") }, // Adjust route as needed
            ]);
        } catch (err) {
            Alert.alert("Error", "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 0:
                return (
                    <View>
                        <Text style={styles.sectionTitle}>Business Identity</Text>
                        <Text style={styles.sectionSubtitle}>
                            Basic details about your business displayed on your public page.
                        </Text>

                        <Text style={styles.label}>Business Logo</Text>
                        <View style={styles.logoRow}>
                            <View style={styles.logoPlaceholder}>
                                <Ionicons name="cloud-upload-outline" size={32} color={colors.textSecondary} />
                            </View>
                            <View style={styles.logoInfo}>
                                <Text style={styles.uploadTitle}>Upload Business Logo</Text>
                                <Text style={styles.uploadSubtitle}>PNG, JPG, WEBP up to 5MB</Text>
                                <TouchableOpacity style={styles.chooseFileBtn} onPress={handleChooseFile}>
                                    <Text style={styles.chooseFileText}>Choose File</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={styles.requiredLabel}>* Business Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your business name"
                            placeholderTextColor={colors.muted}
                            value={formData.businessName}
                            onChangeText={(text) => updateFormData("businessName", text)}
                        />

                        <Text style={styles.label}>Website / Public Link</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="www.example.com"
                            placeholderTextColor={colors.muted}
                            autoCapitalize="none"
                            value={formData.website}
                            onChangeText={(text) => updateFormData("website", text)}
                        />
                    </View>
                );
            case 1:
                return (
                    <View>
                        <Text style={styles.sectionTitle}>Location & Capacity</Text>
                        <Text style={styles.sectionSubtitle}>
                            Manage your physical space details and limitations.
                        </Text>

                        <Text style={styles.requiredLabel}>* Business Location</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your business address"
                            placeholderTextColor={colors.muted}
                            value={formData.location}
                            onChangeText={(text) => updateFormData("location", text)}
                        />

                        <View style={styles.row}>
                            <View style={[styles.col, { marginRight: 8 }]}>
                                <Text style={styles.requiredLabel}>* Number of Rooms</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter rooms"
                                    placeholderTextColor={colors.muted}
                                    keyboardType="numeric"
                                    value={formData.rooms}
                                    onChangeText={(text) => updateFormData("rooms", text)}
                                />
                            </View>
                            <View style={[styles.col, { marginLeft: 8 }]}>
                                <Text style={styles.requiredLabel}>* Number of Chairs</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter chairs"
                                    placeholderTextColor={colors.muted}
                                    keyboardType="numeric"
                                    value={formData.chairs}
                                    onChangeText={(text) => updateFormData("chairs", text)}
                                />
                            </View>
                        </View>
                    </View>
                );
            case 2:
                return (
                    <View>
                        <Text style={styles.sectionTitle}>About</Text>
                        <Text style={styles.sectionSubtitle}>
                            Detailed description about your business for customers.
                        </Text>

                        <Text style={styles.label}>Business Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="We are a creative agency focused on..."
                            placeholderTextColor={colors.muted}
                            multiline
                            textAlignVertical="top"
                            value={formData.description}
                            onChangeText={(text) => updateFormData("description", text)}
                        />
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.screen}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.mainTitle}>Setup Business</Text>
                        <Text style={styles.mainSubtitle}>
                            Let&apos;s create your business profile. This information helps your
                            customers find you.
                        </Text>
                    </View>

                    {/* Progress Tabs */}
                    <View style={styles.progressContainer}>
                        {steps.map((s, index) => {
                            const isActive = index === step;
                            const isCompleted = index < step;
                            return (
                                <View key={index} style={styles.progressItem}>
                                    <View style={[styles.progressBar, (isActive || isCompleted) && styles.progressBarActive]} />
                                    <Text style={[styles.progressText, (isActive || isCompleted) ? styles.progressTextActive : styles.progressTextInactive]}>{s}</Text>
                                </View>
                            );
                        })}
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.contentContainer}>
                        {renderStepContent()}
                    </View>

                </ScrollView>

                {/* Footer Navigation */}
                <View style={styles.footer}>
                    <TouchableOpacity onPress={handleBack} disabled={loading}>
                        <Text style={styles.backButtonText}>
                            {step === 0 ? "← Back" : "← Back"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.nextButton, loading && { opacity: 0.7 }]}
                        onPress={step === steps.length - 1 ? handleFinish : handleNext}
                        disabled={loading}
                    >
                        <Text style={styles.nextButtonText}>
                            {loading ? "Saving..." : step === steps.length - 1 ? "Finish →" : "Continue →"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.surface, // Based on image dark/grey bg, but using colors.surface/background
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 100, // Space for footer
    },
    header: {
        marginBottom: 24,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.textPrimary,
        marginBottom: 8,
    },
    mainSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    progressContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 0,
    },
    progressItem: {
        flex: 1,
        marginRight: 8,
    },
    progressBar: {
        height: 4,
        backgroundColor: colors.border,
        borderRadius: 2,
        marginBottom: 8,
    },
    progressBarActive: {
        backgroundColor: colors.accentBlue,
    },
    progressText: {
        fontSize: 13,
        fontWeight: '500',
    },
    progressTextActive: {
        color: colors.accentBlue,
    },
    progressTextInactive: {
        color: colors.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: 24,
    },
    contentContainer: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.textPrimary,
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: colors.textPrimary,
        marginBottom: 8,
    },
    requiredLabel: {
        fontSize: 14,
        fontWeight: "500",
        color: colors.textPrimary, // Or red if needed, but keeping simple
        marginBottom: 8,
        // Add asterisk color if needed logic
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    logoPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 12,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        marginRight: 16,
    },
    logoInfo: {
        flex: 1,
    },
    uploadTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    uploadSubtitle: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 12,
    },
    chooseFileBtn: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    chooseFileText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    input: {
        backgroundColor: colors.background, // Should appear slightly different if on surface
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: colors.textPrimary,
        marginBottom: 20,
    },
    textArea: {
        height: 120,
        paddingTop: 12,
    },
    row: {
        flexDirection: "row",
    },
    col: {
        flex: 1,
    },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingVertical: 16,
        paddingHorizontal: 24,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    backButtonText: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.textPrimary,
    },
    nextButton: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    nextButtonText: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.onPrimary,
    },
});
