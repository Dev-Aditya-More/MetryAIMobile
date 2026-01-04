import { IconSymbol } from "@/components/ui/icon-symbol";
import { colors } from "@/theme/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

// Mock Data
const DATES = [
    { day: "MON", date: 10, fullDate: "2025-10-10" },
    { day: "TUE", date: 11, fullDate: "2025-10-11" },
    { day: "WED", date: 12, fullDate: "2025-10-12" },
    { day: "THU", date: 13, fullDate: "2025-10-13" },
    { day: "FRI", date: 14, fullDate: "2025-10-14" },
    { day: "SAT", date: 15, fullDate: "2025-10-15" },
];

const TIME_SLOTS = [
    "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "16:00"
];

const SERVICES = [
    {
        id: "s1",
        name: "Milbon 4-Step Treatment",
        duration: "1.5 hours",
        price: 50.00,
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=200&q=80",
    },
    {
        id: "s2",
        name: "Kerastase Ritual",
        duration: "1 hour",
        price: 60.00,
        image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=200&q=80",
    },
    {
        id: "s3",
        name: "Olaplex Hair Repair",
        duration: "1 hour 15 minutes",
        price: 70.00,
        image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=200&q=80",
    },
    {
        id: "s4",
        name: "Redken Color Extend",
        duration: "2 hours",
        price: 55.00,
        image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=200&q=80",
    },
];

export default function BookingScreen() {
    const { id } = useLocalSearchParams(); // In a real app, use this to fetch salon details
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [cart, setCart] = useState<{ [key: string]: number }>({});

    const handleQuantityChange = (serviceId: string, change: number) => {
        setCart(prev => {
            const currentQty = prev[serviceId] || 0;
            const newQty = Math.max(0, currentQty + change);
            if (newQty === 0) {
                const { [serviceId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [serviceId]: newQty };
        });
    };

    const totalAmount = Object.entries(cart).reduce((sum, [id, qty]) => {
        const service = SERVICES.find(s => s.id === id);
        return sum + (service ? service.price * qty : 0);
    }, 0);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Background Image Header */}
            <View style={styles.headerImageContainer}>
                <Image
                    source={{ uri: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80" }}
                    style={styles.headerImage}
                />
                <SafeAreaView style={styles.headerOverlay} edges={['top']}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <IconSymbol name="chevron.left" size={24} color="#000" />
                    </TouchableOpacity>
                </SafeAreaView>
            </View>

            {/* Main Content Sheet */}
            <View style={styles.contentSheet}>
                <View style={styles.dragHandle} />

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Salon Info */}
                    <View style={styles.section}>
                        <Text style={styles.salonName}>Salon Paradisio</Text>
                        <View style={styles.locationRow}>
                            <IconSymbol name="location" size={16} color={colors.textSecondary} />
                            <Text style={styles.locationText}>1995 Broadway, New York</Text>
                        </View>
                    </View>

                    {/* Date Selection */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.sectionTitle}>Select Date</Text>
                            <View style={styles.calendarIconRow}>
                                <IconSymbol name="calendar" size={14} color={colors.textSecondary} />
                                <Text style={styles.monthText}>October 2025</Text>
                            </View>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
                            {DATES.map((item) => {
                                const isSelected = selectedDate === item.fullDate;
                                return (
                                    <TouchableOpacity
                                        key={item.fullDate}
                                        style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                                        onPress={() => setSelectedDate(item.fullDate)}
                                    >
                                        <Text style={[styles.dayText, isSelected && styles.textSelected]}>{item.day}</Text>
                                        <Text style={[styles.dateText, isSelected && styles.textSelected]}>{item.date}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>

                    {/* Time Selection - Only visible if date is selected (or specifically requested logic) */}
                    {selectedDate && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Select Time</Text>
                            <View style={styles.timeGrid}>
                                {TIME_SLOTS.map((time) => {
                                    const isSelected = selectedTime === time;
                                    return (
                                        <TouchableOpacity
                                            key={time}
                                            style={[styles.timeChip, isSelected && styles.timeChipSelected]}
                                            onPress={() => setSelectedTime(time)}
                                        >
                                            <Text style={[styles.timeText, isSelected && styles.textSelected]}>{time}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    )}

                    {/* Service List */}
                    <View style={styles.section}>
                        {SERVICES.map((service) => (
                            <View key={service.id} style={styles.serviceCard}>
                                <Image source={{ uri: service.image }} style={styles.serviceImage} />
                                <View style={styles.serviceInfo}>
                                    <Text style={styles.serviceName}>{service.name}</Text>
                                    <View style={styles.durationRow}>
                                        <IconSymbol name="clock" size={12} color={colors.textSecondary} />
                                        <Text style={styles.durationText}>{service.duration}</Text>
                                    </View>

                                    <View style={styles.priceRow}>
                                        <Text style={styles.priceText}>${service.price.toFixed(2)}</Text>

                                        <View style={styles.quantityControl}>
                                            <TouchableOpacity
                                                style={styles.qtyButton}
                                                onPress={() => handleQuantityChange(service.id, -1)}
                                            >
                                                <IconSymbol name="minus" size={16} color={cart[service.id] ? colors.textPrimary : colors.textSecondary} />
                                            </TouchableOpacity>

                                            <Text style={styles.qtyText}>{cart[service.id] || 0}</Text>

                                            <TouchableOpacity
                                                style={[styles.qtyButton, styles.qtyButtonAdd]}
                                                onPress={() => handleQuantityChange(service.id, 1)}
                                            >
                                                <IconSymbol name="plus" size={16} color="#fff" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Padding for bottom footer */}
                    <View style={{ height: 180 }} />
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    <View>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalAmount}>${totalAmount.toFixed(1)}</Text>
                        <Text style={styles.taxLabel}>Taxes and fees included</Text>
                    </View>
                    <TouchableOpacity style={styles.bookButton}>
                        <Text style={styles.bookButtonText}>Booking</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000", // Dark background for the image area
    },
    headerImageContainer: {
        height: 300,
        width: '100%',
        position: 'absolute',
        top: 0,
    },
    headerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        opacity: 0.9,
    },
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    contentSheet: {
        flex: 1,
        marginTop: 220, // Push down to reveal header image
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden',
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    section: {
        marginBottom: 24,
    },
    salonName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    locationText: {
        fontSize: 14,
        color: colors.textSecondary,
        textDecorationLine: 'underline',
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    calendarIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    monthText: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    dateScroll: {
        flexDirection: 'row',
    },
    dateCard: {
        width: 60,
        height: 70,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        backgroundColor: '#fff',
    },
    dateCardSelected: {
        backgroundColor: '#8E8177', // Matches screenshot accent
        borderColor: '#8E8177',
    },
    dayText: {
        fontSize: 11,
        color: colors.textSecondary,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    dateText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    textSelected: {
        color: '#fff',
    },
    timeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    timeChip: {
        width: '23%', // approx 4 columns
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    timeChipSelected: {
        backgroundColor: '#8E8177',
        borderColor: '#8E8177',
    },
    timeText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    serviceCard: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 16,
    },
    serviceImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
    },
    serviceInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
    serviceName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    durationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    durationText: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 8,
    },
    priceText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textPrimary, // Or specific gold/brown color
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 20,
        padding: 2,
    },
    qtyButton: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
    },
    qtyButtonAdd: {
        backgroundColor: '#8E8177',
    },
    qtyText: {
        width: 30,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '600',
    },
    footer: {
        position: 'absolute',
        bottom: 80, // Lifted above Tab Bar
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingHorizontal: 20,
        paddingVertical: 16, // Fixed padding
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    totalLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    taxLabel: {
        fontSize: 11,
        color: colors.textSecondary,
    },
    bookButton: {
        backgroundColor: '#8E8177',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 25,
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
