import { IconSymbol } from "@/components/ui/icon-symbol";
import { colors } from "@/theme/colors";
import React from "react";
import { Image, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BOOKINGS = [
    {
        id: "1",
        service: "Milbon 4-Step Treatment",
        shop: "Salon Paradisio",
        date: "Nov 4, 2025",
        time: "09:00 AM",
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=200&q=80",
    },
    {
        id: "2",
        service: "Gel Manicure Deluxe",
        shop: "Nail Bar NYC",
        date: "Nov 12, 2025",
        time: "02:30 PM",
        image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=200&q=80",
    },
];

export default function BookingsScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Text style={styles.title}>My Bookings</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {BOOKINGS.map((booking) => (
                    <View key={booking.id} style={styles.card}>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: booking.image }} style={styles.image} />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.serviceName}>{booking.service}</Text>
                            <Text style={styles.shopName}>{booking.shop}</Text>

                            <View style={styles.dateTimeRow}>
                                <View style={styles.infoItem}>
                                    <IconSymbol name="calendar" size={14} color={colors.textSecondary} style={{ marginRight: 6 }} />
                                    <Text style={styles.infoText}>{booking.date}</Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <IconSymbol name="clock" size={14} color={colors.textSecondary} style={{ marginRight: 6 }} />
                                    <Text style={styles.infoText}>{booking.time}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
                {/* Padding for tab bar */}
                <View style={{ height: 20 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff", // White background like design
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
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#f0f0f0",
        // Shadow for iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        // Elevation
        elevation: 2,
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 8,
        overflow: 'hidden',
        marginRight: 15,
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
    },
    serviceName: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.textPrimary,
        marginBottom: 4,
    },
    shopName: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 12,
    },
    dateTimeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    infoText: {
        fontSize: 13,
        color: colors.textSecondary,
    },
});
