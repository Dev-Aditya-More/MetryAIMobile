import { IconSymbol } from "@/components/ui/icon-symbol";
import { colors } from "@/theme/colors";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SecurityScreen() {
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    return (
        <SafeAreaView style={styles.container} edges={['top']}>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>SECURITY</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <View style={styles.content}>

                    {/* Current Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>CURRENT PASSWORD</Text>
                        <View style={styles.inputContainer}>
                            <IconSymbol name="lock.fill" size={20} color={colors.textSecondary} style={{ marginRight: 10 }} />
                            <TextInput
                                style={styles.input}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                placeholder="••••••••••••"
                                placeholderTextColor={colors.textSecondary}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    {/* New Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>NEW PASSWORD</Text>
                        <View style={styles.inputContainer}>
                            <IconSymbol name="lock.fill" size={20} color={colors.textSecondary} style={{ marginRight: 10 }} />
                            <TextInput
                                style={styles.input}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                placeholder="••••••••••••"
                                placeholderTextColor={colors.textSecondary}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    <View style={{ height: 40 }} />

                    {/* Update Button */}
                    <TouchableOpacity style={styles.updateButton}>
                        <Text style={styles.buttonText}>Update Password</Text>
                    </TouchableOpacity>

                    {/* Helper Text */}
                    <Text style={styles.helperText}>
                        We recommend using a strong password with a mix of letters, numbers, and symbols to keep your account secure.
                    </Text>

                </View>
            </KeyboardAvoidingView>
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
        fontSize: 16,
        fontWeight: '500',
        color: colors.textPrimary,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    content: {
        padding: 20,
        flex: 1,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F8F9', // Very light grey background
        borderRadius: 8,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.textPrimary,
        height: '100%',
        letterSpacing: 2, // Spacing for password dots
    },
    updateButton: {
        width: '100%',
        backgroundColor: '#8E8177',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    helperText: {
        textAlign: 'center',
        color: colors.textSecondary,
        fontSize: 13,
        lineHeight: 20,
        paddingHorizontal: 20,
    },
});
