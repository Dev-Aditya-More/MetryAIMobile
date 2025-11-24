/* ------------------------------ IMPORTS ------------------------------ */
import facialImg from "@/assets/images/facial.jpg";
import haircutImg from "@/assets/images/haircut.jpg";
import manicureImg from "@/assets/images/manicure.jpg";
import massageImg from "@/assets/images/massage.jpg";
import BottomNav from "@/components/BottomNav";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
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
  rating: number;
  reviews: number;
  sold: number;
};

const PRODUCTS: Product[] = [
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

/* ------------------------------ SCREEN ------------------------------ */

export default function ProductsScreen() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredProducts = useMemo(() => {
    const q = searchText.trim().toLowerCase();

    return PRODUCTS.filter((p) => {
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;

      const matchesSearch =
        q.length === 0 ||
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [searchText, selectedCategory]);

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => {
          console.log("Pressed product:", item.title);
        }}
      >
        <Image source={item.image} style={styles.cardImage} />
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>

          <View style={styles.cardRatingRow}>
            <MaterialIcons name="star" size={14} color="#F59E0B" />
            <Text style={styles.cardRatingText}>
              {item.rating.toFixed(1)} ({item.reviews})
            </Text>
          </View>

          <View style={styles.cardFooterRow}>
            <Text style={styles.cardPrice}>${item.price}</Text>
            <Text style={styles.cardSold}>{item.sold} sold</Text>
          </View>
        </View>
      </TouchableOpacity>
    ),
    []
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

      {/* Product Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderProduct}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() => {
          console.log("FAB pressed – add new product");
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
    alignSelf: "center", // 👈 prevents stretching vertically
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
    paddingBottom: 100, // space for BottomNav + FAB
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
    bottom: 80, // a bit above BottomNav
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
