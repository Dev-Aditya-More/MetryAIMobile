import { colors } from "@/theme/colors";
import React from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// --- Mock Data ---

const CATEGORIES = [
    { id: "1", name: "Hair Salon", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=100&q=80" },
    { id: "2", name: "Massage", image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=100&q=80" },
    { id: "3", name: "Beauty Salon", image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=100&q=80" },
    { id: "4", name: "Gym", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=100&q=80" },
];

const EDITORIAL_PICKS = [
    { id: "1", title: "Grand Mesh Style", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80", type: "large" },
    { id: "2", title: "Creative Color", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80", type: "small" },
    { id: "3", title: "Dark Tone Color", image: "https://images.unsplash.com/photo-1523264626871-33230559f33b?auto=format&fit=crop&w=200&q=80", type: "small" },
    { id: "4", title: "Face-Framing Color", image: "https://images.unsplash.com/photo-1512413348685-61dd8331fa9b?auto=format&fit=crop&w=300&q=80", type: "wide" },
];

const NEW_ARRIVALS = [
    { id: "1", image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=150&q=80" },
    { id: "2", image: "https://images.unsplash.com/photo-1595627250624-94572230612c?auto=format&fit=crop&w=150&q=80" },
    { id: "3", image: "https://images.unsplash.com/photo-1521590832169-231a4cc6f654?auto=format&fit=crop&w=150&q=80" },
];

const BEST_BOOKING = [
    {
        id: "1",
        name: "HAIR SALON",
        duration: "1h duration",
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=250&q=80",
        rating: 5.0,
    },
    {
        id: "2",
        name: "Beauty Salon",
        duration: "1h duration",
        image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=250&q=80",
        rating: 4.8,
    },
];

const TREND_FORECAST = [
    { id: "1", image: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=400&q=80" },
    { id: "2", image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=400&q=80" },
];


export default function CustomerHome() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.headerTopRow}>
                        {/* Icons would go here if we were doing status bar manually, but unnecessary with StatusBar component */}
                    </View>
                    <View style={styles.heroContainer}>
                        <Image
                            source={{ uri: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=400&q=80" }}
                            style={styles.heroImage}
                        />
                        <View style={styles.heroOverlay}>
                            <Text style={styles.heroTitle}>Find a Service{"\n"}Close to You</Text>
                            <Text style={styles.heroSubtitle}>Explore a world of diverse booking services</Text>
                        </View>
                    </View>
                </View>

                {/* Categories Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Categories</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
                        {CATEGORIES.map((cat) => (
                            <View key={cat.id} style={styles.categoryItem}>
                                <View style={styles.categoryImageContainer}>
                                    <Image source={{ uri: cat.image }} style={styles.categoryImage} />
                                </View>
                                <Text style={styles.categoryName}>{cat.name}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Editorial Picks - Masonry-ish Layout */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Beauty Editorial Team Picks</Text>
                    <View style={styles.editorialGrid}>
                        <View style={styles.editorialColumn}>
                            <View style={[styles.editorialItem, { height: 220 }]}>
                                <Image source={{ uri: EDITORIAL_PICKS[0].image }} style={styles.editorialImage} />
                                <View style={styles.editorialOverlay}>
                                    <Text style={styles.editorialTitle}>{EDITORIAL_PICKS[0].title}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.editorialColumn}>
                            <View style={[styles.editorialItem, { height: 100, marginBottom: 15 }]}>
                                <Image source={{ uri: EDITORIAL_PICKS[1].image }} style={styles.editorialImage} />
                                <View style={styles.editorialOverlay}>
                                    <Text style={styles.editorialTitle}>{EDITORIAL_PICKS[1].title}</Text>
                                </View>
                            </View>
                            <View style={[styles.editorialItem, { height: 105 }]}>
                                <Image source={{ uri: EDITORIAL_PICKS[2].image }} style={styles.editorialImage} />
                                <View style={styles.editorialOverlay}>
                                    <Text style={styles.editorialTitle}>{EDITORIAL_PICKS[2].title}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.editorialItem, { height: 120, marginTop: 15 }]}>
                        <Image source={{ uri: EDITORIAL_PICKS[3].image }} style={styles.editorialImage} />
                        <View style={styles.editorialOverlay}>
                            <Text style={styles.editorialTitle}>{EDITORIAL_PICKS[3].title}</Text>
                        </View>
                    </View>
                </View>

                {/* New Arrivals */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>New Arrivals</Text>
                    {/* Chips */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                        {["Fashion", "Hair", "Beauty", "Nail"].map((chip, index) => (
                            <TouchableOpacity key={index} style={[styles.chip, index === 0 && styles.activeChip]}>
                                <Text style={[styles.chipText, index === 0 && styles.activeChipText]}>{chip}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                        {NEW_ARRIVALS.map((item) => (
                            <View key={item.id} style={styles.arrivalCard}>
                                <Image source={{ uri: item.image }} style={styles.arrivalImage} />
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Best Booking */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Our Best Booking This Month</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                        {BEST_BOOKING.map((item) => (
                            <View key={item.id} style={styles.bookingCard}>
                                <Image source={{ uri: item.image }} style={styles.bookingImage} />
                                <View style={styles.bookingInfo}>
                                    <Text style={styles.bookingName}>{item.name}</Text>
                                    <Text style={styles.bookingDuration}>{item.duration}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Trend Forecast */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Trend Forecast</Text>
                        <TouchableOpacity><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
                    </View>

                    {TREND_FORECAST.map((item) => (
                        <View key={item.id} style={styles.trendCard}>
                            <Image source={{ uri: item.image }} style={styles.trendImage} />
                        </View>
                    ))}
                </View>

                {/* Bottom padding for tab bar */}
                <View style={{ height: 80 }} />

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollContent: {
        paddingBottom: 20,
    },
    header: {
        marginBottom: 20,
    },
    headerTopRow: {
        position: 'absolute',
        top: 10,
        left: 20,
        right: 20,
        zIndex: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerTime: {
        color: '#fff', // Assuming image needs white text
        fontWeight: '600',
        fontSize: 14,
    },
    heroContainer: {
        height: 350,
        width: '100%',
        position: 'relative',
        backgroundColor: '#ccc',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    heroOverlay: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: "700",
        color: "#fff",
        marginBottom: 8,
        lineHeight: 34,
    },
    heroSubtitle: {
        fontSize: 14,
        color: "rgba(255,255,255,0.9)",
    },
    section: {
        marginTop: 25,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.textPrimary,
        marginBottom: 10,
    },
    viewAllText: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    categoriesList: {
        paddingRight: 20,
    },
    categoryItem: {
        alignItems: "center",
        marginRight: 20,
        width: 70,
    },
    categoryImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        backgroundColor: colors.surface,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    categoryName: {
        fontSize: 12,
        color: colors.textPrimary,
        textAlign: "center",
    },
    editorialGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    editorialColumn: {
        width: '48%',
    },
    editorialItem: {
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#f0f0f0',
    },
    editorialImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    editorialOverlay: {
        position: 'absolute',
        bottom: 10,
        left: 10,
    },
    editorialTitle: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    chipScroll: {
        marginBottom: 15,
    },
    chip: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: colors.surface,
        marginRight: 10,
    },
    activeChip: {
        backgroundColor: '#fff', // Or primary color if preferred, simplistic style kept
        borderWidth: 1,
        borderColor: '#eee',
    },
    chipText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    activeChipText: {
        color: colors.textPrimary,
    },
    horizontalList: {
        paddingRight: 20,
    },
    arrivalCard: {
        width: 140,
        height: 180,
        borderRadius: 12,
        overflow: 'hidden',
        marginRight: 15,
        backgroundColor: colors.surface,
    },
    arrivalImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    bookingCard: {
        width: 250,
        marginRight: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        overflow: 'hidden',
    },
    bookingImage: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    bookingInfo: {
        padding: 12,
    },
    bookingName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    bookingDuration: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    trendCard: {
        height: 200,
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
    },
    trendImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});
