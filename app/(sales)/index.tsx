import facialImg from "@/assets/images/facial.jpg";
import haircutImg from "@/assets/images/haircut.jpg";
import manicureImg from "@/assets/images/manicure.jpg";
import massageImg from "@/assets/images/massage.jpg";
import profileImg from "@/assets/images/profile.jpg";
import BottomNav from "@/components/BottomNav";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const categories = ["All", "Hair", "Nails", "Facial"];

const SERVICES = [
  { id: "1", title: "Haircut", price: 50, image: haircutImg, category: "Hair" },
  {
    id: "2",
    title: "Manicure",
    price: 35,
    image: manicureImg,
    category: "Nails",
  },
  { id: "3", title: "Facial", price: 75, image: facialImg, category: "Facial" },
  {
    id: "4",
    title: "Massage",
    price: 90,
    image: massageImg,
    category: "Facial",
  },
];

const CUSTOMERS = [
  { name: "Sarah Johnson", email: "sarah.j@email.com", phone: "+18487474747" },
  { name: "Michael Chen", email: "mchen@email.com", phone: "+18482342347" },
  { name: "Emily Davis", email: "emily.d@email.com", phone: "+18489234562" },
  { name: "James Wilson", email: "jwilson@email.com", phone: "+18484323456" },
  { name: "Lisa Anderson", email: "lisa.a@email.com", phone: "+18484321234" },
];

export default function SalesScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(CUSTOMERS[0]);
  const [searchText, setSearchText] = useState("");

  const router = useRouter();

  const filteredCustomers = CUSTOMERS.filter((c) =>
    c.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const handleAddCustomer = () => {
    console.log("Add customer button clicked");
    // You can later open a modal or navigate to Add Customer screen here
  };

  const filteredServices =
    selectedCategory === "All"
      ? SERVICES
      : SERVICES.filter((s) => s.category === selectedCategory);

  const toggleSelectService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const totalAmount = selectedServices.reduce((acc, id) => {
    const s = SERVICES.find((x) => x.id === id);
    return acc + (s?.price ?? 0);
  }, 0);

  const cartCount = selectedServices.length;

  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setShowDropdown(false);
    Keyboard.dismiss();
  };

  const handleOutsidePress = () => {
    if (showDropdown) {
      setShowDropdown(false);
      Keyboard.dismiss();
    }
  };

  const vieworder = () => {
    router.push("/order-summary");
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        {/* Header */}
        <View style={styles.header}>
          <View style={{ position: "relative" }}>
            <View style={styles.profileContainer}>
              {/* Person Add Button */}
              <TouchableOpacity
                onPress={handleAddCustomer} // ← NEW FUNCTION CALL
                style={styles.iconButton}
              >
                <Ionicons name="person-add-outline" size={20} color="#111827" />
              </TouchableOpacity>

              {/* Profile Box — toggle dropdown */}
              <TouchableOpacity
                onPress={() => setShowDropdown(!showDropdown)} // ← toggle dropdown here
                activeOpacity={0.8}
                style={styles.profileBox}
              >
                <Image source={profileImg} style={styles.profileImage} />
                <Text style={styles.profileName}>{selectedCustomer.name}</Text>
                <Ionicons name="chevron-down" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Dropdown */}
            {showDropdown && (
              <View style={styles.dropdown}>
                <View style={styles.searchBox}>
                  <Ionicons name="search" size={16} color="#9CA3AF" />
                  <TextInput
                    placeholder="Search customers..."
                    placeholderTextColor="#9CA3AF"
                    style={styles.searchInput}
                    value={searchText}
                    onChangeText={setSearchText}
                  />
                </View>
                <FlatList
                  data={filteredCustomers}
                  keyExtractor={(item) => item.email}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.dropdownItem,
                        item.name === selectedCustomer.name &&
                          styles.activeItem,
                      ]}
                      onPress={() => handleSelectCustomer(item)}
                    >
                      <View>
                        <Text style={styles.dropdownName}>{item.name}</Text>
                        <Text style={styles.dropdownEmail}>{item.email}</Text>
                      </View>
                      {item.name === selectedCustomer.name && (
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color="#6B7280"
                          style={{ marginLeft: "auto" }}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>

          {/* Cart */}
          <TouchableOpacity style={styles.cart}>
            <Ionicons name="cart-outline" size={22} color="#111827" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartCount}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Category Filter */}
        <View style={styles.categoryContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                selectedCategory === cat && styles.activeCategory,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.activeCategoryText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Services Grid */}
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={styles.serviceList}
          renderItem={({ item }) => {
            const isSelected = selectedServices.includes(item.id);
            return (
              <TouchableOpacity
                onPress={() => toggleSelectService(item.id)}
                style={[styles.card, isSelected && styles.cardSelected]}
              >
                <Image source={item.image} style={styles.cardImage} />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <View>
            <Text style={styles.itemCount}>{cartCount} items</Text>
            <Text style={styles.totalText}>
              Total:{" "}
              <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.viewOrderButton,
              selectedServices.length === 0 && { backgroundColor: "#E5E7EB" }, // gray out
            ]}
            onPress={selectedServices.length > 0 ? vieworder : undefined}
            disabled={selectedServices.length === 0}
          >
            <Text
              style={[
                styles.viewOrderText,
                selectedServices.length === 0 && { color: "#9CA3AF" },
              ]}
            >
              View Order
            </Text>
          </TouchableOpacity>
        </View>

        <BottomNav />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    zIndex: 10,
  },
  profileContainer: { flexDirection: "row", alignItems: "center" },
  iconButton: {
    backgroundColor: "#F3F4F6",
    padding: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  profileBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 8,
    paddingVertical: 6,
    width: 170,
  },
  profileImage: { width: 24, height: 24, borderRadius: 12, marginRight: 6 },
  profileName: { fontWeight: "500", color: "#111827", flex: 1 },
  dropdown: {
    position: "absolute",
    top: 45,
    left: 48,
    width: 210,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: 220,
    zIndex: 999,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  searchInput: {
    flex: 1,
    marginLeft: 6,
    fontSize: 14,
    color: "#111827",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  activeItem: { backgroundColor: "#F9FAFB" },
  dropdownName: { fontWeight: "500", color: "#111827" },
  dropdownEmail: { fontSize: 12, color: "#6B7280" },
  cart: { position: "relative" },
  cartBadge: {
    position: "absolute",
    right: -6,
    top: -4,
    backgroundColor: "#DC2626",
    borderRadius: 10,
    paddingHorizontal: 4,
  },
  cartCount: { color: "#FFF", fontSize: 10 },
  categoryContainer: {
    flexDirection: "row",
    marginTop: 12,
    marginHorizontal: 16,
  },
  categoryButton: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  activeCategory: { backgroundColor: "#111827" },
  categoryText: { color: "#6B7280", fontSize: 14 },
  activeCategoryText: { color: "#FFF", fontWeight: "500" },
  serviceList: { padding: 16, paddingBottom: 120 },
  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: "#D1CCC2",
  },
  cardImage: { width: "100%", height: 130 },
  cardContent: { padding: 8 },
  cardTitle: { fontWeight: "500", color: "#4B5563" },
  cardPrice: { color: "#9CA3AF", marginTop: 2 },
  summaryContainer: {
    position: "absolute",
    bottom: 70,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemCount: { color: "#6B7280", fontSize: 13 },
  totalText: { color: "#111827", fontWeight: "500" },
  totalAmount: { fontWeight: "700" },
  viewOrderButton: {
    backgroundColor: "#D1CCC2",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  viewOrderText: { color: "#111827", fontWeight: "600" },
});
