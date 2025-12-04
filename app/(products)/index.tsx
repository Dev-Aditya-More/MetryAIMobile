/* ------------------------------ IMPORTS ------------------------------ */
import { ProductService } from "@/api/products";
import facialImg from "@/assets/images/facial.jpg";
import haircutImg from "@/assets/images/haircut.jpg";
import manicureImg from "@/assets/images/manicure.jpg";
import massageImg from "@/assets/images/massage.jpg";
import BottomNav from "@/components/BottomNav";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* ------------------------------ DATA ------------------------------ */

const CATEGORIES = ["All", "Hair", "Makeup", "Skin", "Nails"];

type Product = {
  id: string;
  title: string;
  price: number;
  image: any;
  category: string;
  rating?: number;
  reviews?: number;
  sold?: number;
};

// Optional: fallback static data if API fails
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Nail Art",
    price: 35,
    image: manicureImg,
    category: "Nails",
    rating: 4.7,
    reviews: 180,
    sold: 300,
  },
  {
    id: "2",
    title: "Gel Manicure",
    price: 40,
    image: manicureImg,
    category: "Nails",
    rating: 4.8,
    reviews: 220,
    sold: 400,
  },
  {
    id: "3",
    title: "Pedicure Delight",
    price: 45,
    image: massageImg,
    category: "Skin",
    rating: 4.6,
    reviews: 150,
    sold: 250,
  },
  {
    id: "4",
    title: "Acrylic Enhancement",
    price: 50,
    image: manicureImg,
    category: "Nails",
    rating: 4.9,
    reviews: 210,
    sold: 500,
  },
  {
    id: "5",
    title: "Nail Art Workshop",
    price: 60,
    image: haircutImg,
    category: "Hair",
    rating: 4.5,
    reviews: 90,
    sold: 150,
  },
  {
    id: "6",
    title: "Luxury Nail Treatment",
    price: 70,
    image: facialImg,
    category: "Skin",
    rating: 4.8,
    reviews: 130,
    sold: 200,
  },
  {
    id: "7",
    title: "Spa Pedicure",
    price: 55,
    image: massageImg,
    category: "Skin",
    rating: 4.7,
    reviews: 175,
    sold: 320,
  },
  {
    id: "8",
    title: "Nail Polish Collection",
    price: 25,
    image: manicureImg,
    category: "Makeup",
    rating: 4.3,
    reviews: 60,
    sold: 80,
  },
];

/* Helper: map backend service → category + image */
const mapServiceToCategoryAndImage = (serviceTypeId: string, name: string) => {
  const lower = (serviceTypeId || name || "").toLowerCase();

  if (lower.includes("hair")) {
    return { category: "Hair", image: haircutImg };
  }
  if (lower.includes("nail")) {
    return { category: "Nails", image: manicureImg };
  }
  if (lower.includes("skin") || lower.includes("facial")) {
    return { category: "Skin", image: facialImg };
  }
  if (lower.includes("massage")) {
    return { category: "Skin", image: massageImg };
  }

  // default
  return { category: "All", image: manicureImg };
};

/* ------------------------------ SCREEN ------------------------------ */

export default function ProductsScreen() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Load products from backend once
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await ProductService.searchProduct("", "1", "10");
        console.log("Products raw response:", res);

        const apiList = (res as any)?.list ?? [];

        const mapped: Product[] = apiList.map((item: any) => {
          const { category, image } = mapServiceToCategoryAndImage(
            item.serviceTypeId,
            item.name
          );

          return {
            id: item.id,
            title: item.name,
            price: item.price,
            image,
            category,
            // Dummy values until backend provides these
            rating: 4.8,
            reviews: 100,
            sold: 200,
          };
        });

        setProducts(mapped);
      } catch (e: any) {
        console.error("Failed to load products", e);
        setError("Failed to load products");
        // fallback to static data so UI still shows something
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const q = searchText.trim().toLowerCase();

    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;

      const matchesSearch =
        q.length === 0 ||
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [searchText, selectedCategory, products]);

  const handlePressProduct = useCallback(
    (item: Product) => {
      // Navigate to service-edit and pass the product id
      router.push({
        pathname: "/(products)/service-edit",
        params: { productId: item.id },
      });
    },
    [router]
  );

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => {
      const rating = item.rating ?? 0;
      const reviews = item.reviews ?? 0;
      const sold = item.sold ?? 0;

      return (
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => handlePressProduct(item)}
        >
          <Image source={item.image} style={styles.cardImage} />
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>

            <View style={styles.cardRatingRow}>
              <MaterialIcons name="star" size={14} color="#F59E0B" />
              <Text style={styles.cardRatingText}>
                {rating.toFixed(1)} ({reviews})
              </Text>
            </View>

            <View style={styles.cardFooterRow}>
              <Text style={styles.cardPrice}>${item.price}</Text>
              <Text style={styles.cardSold}>{sold} sold</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [handlePressProduct]
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={18} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#9CA3AF"
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
          returnKeyType="search"
        />
      </View>

      {/* Categories */}
      <View style={styles.categoryContainer}>
        {CATEGORIES.map((cat) => {
          const active = cat === selectedCategory;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[styles.categoryButton, active && styles.activeCategory]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryText,
                  active && styles.activeCategoryText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Loading & error */}
      {loading && (
        <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
      )}

      {!loading && error && (
        <Text style={{ textAlign: "center", marginTop: 20, color: "red" }}>
          {error}
        </Text>
      )}

      {/* Product Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderProduct}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading ? (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No products found.
            </Text>
          ) : null
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() => {
          router.push("/(products)/service-add");
        }}
      >
        <Ionicons name="add" size={26} color="#FFFFFF" />
      </TouchableOpacity>

      <BottomNav />
    </SafeAreaView>
  );
}

/* ------------------------------ STYLES ------------------------------ */

const CARD_GAP = 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  /* Search */
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: "#111827",
  },

  /* Categories */
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    marginRight: 8,
    alignSelf: "center",
  },
  activeCategory: {
    backgroundColor: "#4F46E5",
  },
  categoryText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  activeCategoryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  /* Product list */
  listContent: {
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: CARD_GAP,
  },

  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: CARD_GAP / 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  cardImage: {
    width: "100%",
    height: 120,
  },
  cardBody: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  cardRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  cardRatingText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  cardFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2563EB",
  },
  cardSold: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  /* FAB */
  fab: {
    position: "absolute",
    right: 20,
    bottom: 80,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
});
