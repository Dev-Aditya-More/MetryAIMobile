/* ------------------------------ IMPORTS ------------------------------ */
import facialImg from "@/assets/images/facial.jpg";
import haircutImg from "@/assets/images/haircut.jpg";
import manicureImg from "@/assets/images/manicure.jpg";
import massageImg from "@/assets/images/massage.jpg";
import profileImg from "@/assets/images/profile.jpg";
import BottomNav from "@/components/BottomNav";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBooking } from "./context/SalesContext";

/* ------------------------------ DATA ------------------------------ */
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

/* ------------------------------ MAIN SCREEN ------------------------------ */
export default function SalesScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null); // ⬅️ Start as null
  const [searchText, setSearchText] = useState("");
  const [customers, setCustomers] = useState(CUSTOMERS);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const { booking, setCustomer, setServices } = useBooking();
  const router = useRouter();

  useEffect(() => {
    console.log(booking.services);
  }, [booking.services]);

  /* ------------------------------ HANDLERS ------------------------------ */
  const handleAddCustomer = () => {
    setShowAddCustomer(true);
  };

  const handleSaveCustomer = () => {
    if (!newCustomer.name.trim()) return;

    const updated = [
      ...customers,
      {
        name: newCustomer.name.trim(),
        email: newCustomer.email.trim(),
        phone: newCustomer.phone.trim(),
      },
    ];
    setCustomers(updated);
    setSelectedCustomer(updated[updated.length - 1]);
    setNewCustomer({ name: "", email: "", phone: "" });
    setShowAddCustomer(false);
    setShowDropdown(false);
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
    setSearchText("");
    Keyboard.dismiss();
  };

  const handleOutsidePress = () => {
    if (showDropdown) {
      setShowDropdown(false);
      setSearchText("");
      Keyboard.dismiss();
    }
  };

  const vieworder = () => {
    if (!selectedCustomer) return; // ⬅️ Prevent proceeding without customer
    const selectedServiceObjects = SERVICES.filter((s) =>
      selectedServices.includes(s.id)
    ).map(({ id, title, price }) => ({ id, title, price }));

    console.log(selectedServiceObjects);
    setServices(selectedServiceObjects);

    const numericPhone = Number(
      String(selectedCustomer.phone || "").replace(/\D/g, "")
    );
    setCustomer({ ...selectedCustomer, phone: numericPhone });

    router.push("/order-summary");
  };

  /* ------------------------------ UI ------------------------------ */
  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            {/* Profile Dropdown */}
            <TouchableOpacity
              onPress={() => setShowDropdown(!showDropdown)}
              activeOpacity={0.8}
              style={[styles.profileBox, { flex: 1 }]}
            >
              <Image source={profileImg} style={styles.profileImage} />
              <Text style={styles.profileName}>
                {selectedCustomer ? selectedCustomer.name : "Select Customer"}{" "}
                {/* ⬅️ */}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#6B7280" />
            </TouchableOpacity>
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

        {/* Dropdown */}
        {showDropdown && (
          <View style={[styles.dropdown, { left: 16, right: 16 }]}>
            <View style={styles.searchWrapper}>
              <View style={styles.searchBox}>
                <Ionicons name="search" size={16} color="#9CA3AF" />
                <TextInput
                  placeholder="Search or select customer..."
                  placeholderTextColor="#9CA3AF"
                  style={styles.searchInput}
                  value={searchText}
                  onChangeText={setSearchText}
                  autoFocus
                />
              </View>

              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddCustomer}
              >
                <Ionicons name="person-add-outline" size={16} color="#111827" />
                <Text style={styles.addButtonText}>Add New Customer</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={
                searchText.length > 0
                  ? customers.filter((c) =>
                      c.name.toLowerCase().includes(searchText.toLowerCase())
                    )
                  : customers
              }
              keyExtractor={(item) => item.email}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    selectedCustomer?.name === item.name && styles.activeItem,
                  ]}
                  onPress={() => handleSelectCustomer(item)}
                >
                  <View>
                    <Text style={styles.dropdownName}>{item.name}</Text>
                    <Text style={styles.dropdownEmail}>{item.email}</Text>
                  </View>
                  {selectedCustomer?.name === item.name && (
                    <Ionicons name="checkmark" size={16} color="#6B7280" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Categories */}
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
                onPress={() => {
                  if (!selectedCustomer) return; // Prevent service selection if no customer
                  toggleSelectService(item.id);
                }}
                activeOpacity={selectedCustomer ? 0.8 : 1}
                style={[
                  styles.card,
                  isSelected && styles.cardSelected,
                  !selectedCustomer && styles.cardDisabled, // Add dimming style
                ]}
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
              (selectedServices.length === 0 || !selectedCustomer) && {
                backgroundColor: "#E5E7EB",
              },
            ]}
            onPress={
              selectedServices.length > 0 && selectedCustomer
                ? vieworder
                : undefined
            }
            disabled={selectedServices.length === 0 || !selectedCustomer}
          >
            <Text
              style={[
                styles.viewOrderText,
                (selectedServices.length === 0 || !selectedCustomer) && {
                  color: "#9CA3AF",
                },
              ]}
            >
              View Order
            </Text>
          </TouchableOpacity>
        </View>

        {/* ---------------- Add Customer Modal ---------------- */}
        <Modal visible={showAddCustomer} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Add New Customer</Text>

              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#9CA3AF"
                value={newCustomer.name}
                onChangeText={(t) =>
                  setNewCustomer({ ...newCustomer, name: t })
                }
                style={styles.modalInput}
              />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                value={newCustomer.email}
                onChangeText={(t) =>
                  setNewCustomer({ ...newCustomer, email: t })
                }
                style={styles.modalInput}
              />
              <TextInput
                placeholder="Phone"
                placeholderTextColor="#9CA3AF"
                value={newCustomer.phone}
                onChangeText={(t) =>
                  setNewCustomer({ ...newCustomer, phone: t })
                }
                style={styles.modalInput}
                keyboardType="phone-pad"
              />

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveCustomer}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddCustomer(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <BottomNav />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

/* ------------------------------ STYLES ------------------------------ */
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
    top: 80,
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    maxHeight: 260,
    zIndex: 999,
  },

  searchWrapper: {
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    paddingBottom: 8,
    marginBottom: 4,
    backgroundColor: "#fff",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: "#111827" },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addButtonText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
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
  cardSelected: { borderWidth: 2, borderColor: "#D1CCC2" },
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

  /* --- Modal --- */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "88%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111827",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },
  saveButton: {
    backgroundColor: "#D1CCC2",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },
  cancelButton: {
    marginTop: 10,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cancelButtonText: { color: "#6B7280", fontWeight: "500", fontSize: 14 },
  saveButtonText: {
    color: "#111827", // Deep gray for good contrast
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  cardDisabled: {
    opacity: 0.5,
  },
});
