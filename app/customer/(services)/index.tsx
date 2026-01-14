import { IconSymbol } from "@/components/ui/icon-symbol";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { colors } from "@/theme/colors";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { FilterFlow } from "./components/FilterFlow";

const SALONS = [
    {
        id: "1",
        name: "Bistro de Paris",
        address: "4-5-6 Nishishinjuku, Shinjuku",
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: "2",
        name: "La Bella Italia",
        address: "12 Via Roma, Florence",
        image: "https://images.unsplash.com/photo-1521590832169-231a4cc6f654?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: "3",
        name: "Sushi Samurai",
        address: "78 Harajuku, Tokyo",
        image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: "4",
        name: "Classic Cuts",
        address: "10 Downing St, London",
        image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80",
    },
];

export default function ServicesScreen() {
    const [searchQuery, setSearchQuery] = useState("");
    const [hasFiltered, setHasFiltered] = useState(false);
    const [filterData, setFilterData] = useState<any>(null);
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handlePressSalon = (id: string) => {
        router.push(`/customer/(services)/${id}`);
    };

    const handleFilterComplete = (data: any) => {
        console.log("Filter Data:", data);
        setFilterData(data);
        setHasFiltered(true);
    };

    if (!hasFiltered) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <StatusBar barStyle="dark-content" />
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Services</Text>
                    <TouchableOpacity onPress={() => {
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            // If we can't go back, likely we are at the tab root.
                            // However, we are in a 'filter mode' which replaced the main content.
                            // But wait, this is the main screen. If the user wants to 'close' the services screen
                            // they probably want to go to the previous tab or home.
                            // A safe bet is replacing to the home route.
                            router.replace('/');
                        }
                    }} style={styles.closeBtn}>
                        <IconSymbol name="xmark" size={20} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>
                <FilterFlow onComplete={handleFilterComplete} />
                {/* Bottom padding for tab bar */}
                <View style={{ height: TAB_BAR_HEIGHT + Math.max(insets.bottom, 20) }} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
                    <TextInput
                        style={styles.input}
                        placeholder={filterData?.where || "Find a salon..."}
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <TouchableOpacity onPress={() => setHasFiltered(false)}>
                    <Text style={styles.filterText}>Filter</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Maybe show a summary of filters here? */}
                {SALONS.map((salon) => (
                    <TouchableOpacity
                        key={salon.id}
                        style={styles.card}
                        onPress={() => handlePressSalon(salon.id)}
                        activeOpacity={0.9}
                    >
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: salon.image }} style={styles.image} />
                        </View>
                        <View style={styles.cardContent}>
                            <View style={styles.textContainer}>
                                <Text style={styles.salonName}>{salon.name}</Text>
                                <View style={styles.addressRow}>
                                    <IconSymbol name="location.fill" size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
                                    <Text style={styles.salonAddress}>{salon.address}</Text>
                                </View>
                            </View>
                            <View style={styles.arrowButton}>
                                <IconSymbol name="arrow.up.right" size={20} color="#fff" />
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
                {/* Helper view to pad bottom for tab bar */}
                {/* Helper view to pad bottom for tab bar */}
                <View style={{ height: TAB_BAR_HEIGHT + Math.max(insets.bottom, 20) }} />
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
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    closeBtn: {
        padding: 4,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 44,
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.textPrimary,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.primary,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 20,
        overflow: 'hidden',
        // Shadow for iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        // Elevation for Android
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    imageContainer: {
        height: 180,
        width: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: "cover",
    },
    cardContent: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    salonName: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.textPrimary,
        marginBottom: 6,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    salonAddress: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    arrowButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#A89E96', // Color from screenshot roughly
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
});
