import { BusinessService } from "@/api/customer/business";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { colors } from "@/theme/colors";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { FilterFlow } from "./components/FilterFlow";

const PAGE_SIZE = 10;

export default function ServicesScreen() {
    const [searchQuery, setSearchQuery] = useState("");
    const [hasFiltered, setHasFiltered] = useState(false);
    const [filterData, setFilterData] = useState<any>(null);
    const [businesses, setBusinesses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pageNo, setPageNo] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const router = useRouter();
    const insets = useSafeAreaInsets();

    const fetchBusinesses = useCallback(async (name: string | null = searchQuery, page: number = 1, shouldAppend: boolean = false) => {
        if (page === 1) {
            if (!shouldAppend) setIsLoading(true); // Initial load
            else setIsRefreshing(true); // Pull to refresh
        } else {
            setIsLoadingMore(true);
        }

        setError(null);
        try {
            const response = await BusinessService.getBusinessesDropDown({
                name,
                pageNo: page,
                pageSize: PAGE_SIZE
            });

            if (response.success) {
                const newList = response.data.list || [];
                const total = response.data.total || 0;

                if (shouldAppend) {
                    setBusinesses(prev => [...prev, ...newList]);
                } else {
                    setBusinesses(newList);
                }

                setPageNo(page);
                setHasMore(businesses.length + newList.length < total);
            } else {
                setError(response.error || "Failed to fetch businesses");
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
            setIsRefreshing(false);
        }
    }, [searchQuery, businesses.length]);

    useEffect(() => {
        if (hasFiltered) {
            fetchBusinesses(searchQuery, 1, false);
        }
    }, [hasFiltered]);

    const handleLoadMore = () => {
        if (!isLoadingMore && hasMore && !isLoading && !isRefreshing) {
            fetchBusinesses(searchQuery, pageNo + 1, true);
        }
    };

    const handleRefresh = () => {
        fetchBusinesses(searchQuery, 1, false);
    };

    const handlePressSalon = (id: string) => {
        router.push(`/customer/(services)/${id}`);
    };

    const handleFilterComplete = (data: any) => {
        setFilterData(data);
        setHasFiltered(true);
    };

    const handleSearch = (text: string) => {
        setSearchQuery(text);
    };

    const onSubmitSearch = () => {
        setBusinesses([]);
        fetchBusinesses(searchQuery, 1, false);
    };

    const renderBusinessItem = ({ item: salon }: { item: any }) => (
        <TouchableOpacity
            key={salon.id}
            style={styles.card}
            onPress={() => handlePressSalon(salon.id)}
            activeOpacity={0.9}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: salon.logoUrl || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80" }}
                    style={styles.image}
                />
            </View>
            <View style={styles.cardContent}>
                <View style={styles.textContainer}>
                    <Text style={styles.salonName}>{salon.name}</Text>
                    <View style={styles.addressRow}>
                        <IconSymbol name="location.fill" size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
                        <Text style={styles.salonAddress}>{salon.location || "Various Locations"}</Text>
                    </View>
                </View>
                <View style={styles.arrowButton}>
                    <IconSymbol name="arrow.up.right" size={20} color="#fff" />
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderFooter = () => {
        if (!isLoadingMore) return <View style={{ height: TAB_BAR_HEIGHT + Math.max(insets.bottom, 20) }} />;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={colors.primary} />
                <View style={{ height: TAB_BAR_HEIGHT + Math.max(insets.bottom, 20) }} />
            </View>
        );
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
                            router.replace('/');
                        }
                    }} style={styles.closeBtn}>
                        <IconSymbol name="xmark" size={20} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>
                <FilterFlow onComplete={handleFilterComplete} />
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
                        onChangeText={handleSearch}
                        onSubmitEditing={onSubmitSearch}
                        returnKeyType="search"
                    />
                </View>
                <TouchableOpacity onPress={() => setHasFiltered(false)}>
                    <Text style={styles.filterText}>Filter</Text>
                </TouchableOpacity>
            </View>

            {isLoading && !businesses.length ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : error && !businesses.length ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={() => fetchBusinesses(searchQuery, 1, false)} style={styles.retryButton}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={businesses}
                    renderItem={renderBusinessItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    onRefresh={handleRefresh}
                    refreshing={isRefreshing}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={
                        !isLoading ? (
                            <View style={styles.centerContainer}>
                                <Text style={styles.noResultsText}>No businesses found</Text>
                            </View>
                        ) : null
                    }
                />
            )}
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#ff4444',
        marginBottom: 16,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryText: {
        color: '#fff',
        fontWeight: '600',
    },
    noResultsText: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});
