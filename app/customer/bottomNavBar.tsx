import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter, useSegments } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabKey = "home" | "services" | "bookings" | "account";

export default function BottomNav() {
    const segments = useSegments();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const has = (g: string) => (segments as unknown as string[]).includes(g);

    const active: TabKey = has("(home)")
        ? "home"
        : has("(services)")
            ? "services"
            : has("(booking)")
                ? "bookings"
                : has("(settings)")
                    ? "account"
                    : "home";

    const go = (key: TabKey) => {
        if (key === "home") router.replace("customer/(home)" as Href);
        if (key === "services") router.replace("customer/(services)" as Href);
        if (key === "bookings") router.replace("customer/(booking)" as Href);
        if (key === "account") router.replace("customer/(settings)" as Href);
    };

    const item = (
        key: TabKey,
        iconInactive: keyof typeof Ionicons.glyphMap,
        iconActive: keyof typeof Ionicons.glyphMap,
        label: string
    ) => {
        const isActive = active === key;

        return (
            <TouchableOpacity
                key={key}
                style={styles.tab}
                activeOpacity={0.8}
                onPress={() => go(key)}
            >
                <Ionicons
                    name={isActive ? iconActive : iconInactive}
                    size={24}
                    color={isActive ? colors.primary : colors.muted}
                />
                <Text
                    style={[
                        styles.label,
                        { color: isActive ? colors.primary : colors.muted },
                    ]}
                >
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.root, { paddingBottom: Math.max(insets.bottom, 20), height: TAB_BAR_HEIGHT + Math.max(insets.bottom, 20) }]}>
            {item("home", "home-outline", "home", "Home")}
            {item("services", "grid-outline", "grid", "Services")}
            {item("bookings", "calendar-outline", "calendar", "Bookings")}
            {item("account", "person-outline", "person", "Account")}
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },

    tab: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 12,
        height: 50, // Fixed height for touch target
    },

    label: {
        fontSize: 10,
        fontWeight: "500",
        marginTop: 4,
    },
});
