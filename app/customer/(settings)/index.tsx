import { IconSymbol } from "@/components/ui/icon-symbol";
import { DEFAULT_AVATAR } from "@/constants/images";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { colors } from "@/theme/colors";
import { useFocusEffect, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomerAuthService } from "../../../api/customer/auth";

interface ProfileData {
    avatarUrl: string;
    fullName: string;
    phoneCode: string;
    phone: string;
    email: string;
}

export default function AccountScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [avatarError, setAvatarError] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadProfile();
        }, [])
    );

    const loadProfile = async () => {
        try {
            // Only set loading to true on first load to avoid flickering on re-focus
            if (!profile) setLoading(true);

            const response = await CustomerAuthService.getProfile();
            if (response.success && response.data) {
                setProfile(response.data);
            }
        } catch (error) {
            console.error("Failed to load profile", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditProfile = () => {
        router.push({
            pathname: "/customer/(settings)/edit-profile",
            params: { profileData: profile ? JSON.stringify(profile) : undefined }
        });
    };

    // ======================
    // LOGOUT IMPLEMENTATION
    // ======================

    const handleLogout = async () => {
        try {
            // Clear Secure Storage
            await SecureStore.deleteItemAsync("access_token");
            await SecureStore.deleteItemAsync("refresh_token");
            await SecureStore.deleteItemAsync("user");

            setProfile(null);

            router.replace("/customer/(onboarding)/login");

        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Text style={styles.title}>My Account</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Profile Section */}
                <Text style={styles.sectionHeader}>PROFILE</Text>

                {loading && !profile ? (
                    <View style={[styles.profileCard, { justifyContent: 'center' }]}>
                        <ActivityIndicator size="small" color={colors.primary} />
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.profileCard}
                        onPress={handleEditProfile}
                    >
                        <Image
                            source={{
                                uri: (profile?.avatarUrl && !avatarError) ? profile.avatarUrl : DEFAULT_AVATAR
                            }}
                            style={styles.avatar}
                            onError={() => setAvatarError(true)}
                        />
                        <View style={styles.profileInfo}>
                            <Text style={styles.userName}>{profile?.fullName || "Guest User"}</Text>
                            <Text style={styles.userEmail}>{profile?.email || "No email"}</Text>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={colors.muted} />
                    </TouchableOpacity>
                )}

                {/* Settings Section */}
                <Text style={styles.sectionHeader}>SETTINGS</Text>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => router.push("/customer/(settings)/security")}
                >
                    <View style={styles.iconBox}>
                        <IconSymbol name="shield.fill" size={20} color={colors.textPrimary} />
                    </View>
                    <Text style={styles.menuText}>Privacy & Password</Text>
                    <IconSymbol name="chevron.right" size={20} color={colors.muted} />
                </TouchableOpacity>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <IconSymbol name="arrow.right.square" size={20} color="#EF4444" style={{ marginRight: 8 }} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* Bottom padding for tab bar */}
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
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.textPrimary,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textSecondary,
        marginTop: 20,
        marginBottom: 10,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        borderRadius: 12,
        marginBottom: 10,
        minHeight: 80,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    profileInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        borderRadius: 12,
        marginBottom: 30,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuText: {
        flex: 1,
        fontSize: 15,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        borderRadius: 12,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#EF4444',
    },
});
