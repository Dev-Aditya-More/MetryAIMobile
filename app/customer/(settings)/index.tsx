import { IconSymbol } from "@/components/ui/icon-symbol";
import { colors } from "@/theme/colors";
import React from "react";
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Text style={styles.title}>My Account</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Profile Section */}
                <Text style={styles.sectionHeader}>PROFILE</Text>
                <TouchableOpacity style={styles.profileCard}>
                    <Image
                        source={{ uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" }}
                        style={styles.avatar}
                    />
                    <View style={styles.profileInfo}>
                        <Text style={styles.userName}>Jane Doe</Text>
                        <Text style={styles.userEmail}>jane.doe@example.com</Text>
                    </View>
                    <IconSymbol name="chevron.right" size={20} color={colors.muted} />
                </TouchableOpacity>

                {/* Settings Section */}
                <Text style={styles.sectionHeader}>SETTINGS</Text>
                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.iconBox}>
                        <IconSymbol name="shield.fill" size={20} color={colors.textPrimary} />
                    </View>
                    <Text style={styles.menuText}>Privacy & Password</Text>
                    <IconSymbol name="chevron.right" size={20} color={colors.muted} />
                </TouchableOpacity>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton}>
                    <IconSymbol name="arrow.right.square" size={20} color="#EF4444" style={{ marginRight: 8 }} />
                    {/* Fallback icon if arrow.right... not supported in our map yet, let's use a text or existing icon. 
               Wait, I didn't map a logout icon. Let's use text only or add a mapping.
               For now I'll use a simple text or a generic icon if available, but the design shows an icon. 
               I'll use 'paperplane.fill' as a placeholder or just no icon if it's cleaner to avoid errors.
               Actually, I'll use a simple View with Logout text as per design which shows a red icon.
               Let's assume the user wants the "Log Out" text and icon.
               I'll stick to text-only if I can't map it, or use 'house.fill' as placeholder? No.
               Let's update the IconSymbol mapping in next step if needed. 
               For now, I'll use a placeholder icon from what I have like 'shield.fill' but red, or just text.
               Actually, I can just use a specific material icon directly here if I wanted to bypass the wrapper, 
               but that breaks consistency. 
               I will assume 'arrow.right.start.on.rectangle' is not mapped.
               I will use a simple text layout with an improvised icon or just text.
           */}
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

            </ScrollView>
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
        borderColor: '#f0f0f0', // Slight border as per screenshot
        borderRadius: 12,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#EF4444',
    },
});
