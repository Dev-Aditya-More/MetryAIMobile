/* ------------------------------ IMPORTS ------------------------------ */
import { ProductService } from "@/api/products";
import facialImg from "@/assets/images/facial.jpg";
import haircutImg from "@/assets/images/haircut.jpg";
import manicureImg from "@/assets/images/manicure.jpg";
import massageImg from "@/assets/images/massage.jpg";
import BottomNav from "@/components/BottomNav";
import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
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

/* ------------------------------ TYPES ------------------------------ */
type ApiService = {
  id: string;
  name: string;
  price: number;
  serviceTypeId: string;
};

/* ------------------------------ STATIC CATEGORIES ------------------------------ */
const categories = ["All", "Hair", "Nails", "Facial"];

/* ------------------------------ CATEGORY MAPPER ------------------------------ */
function mapServiceToCategory(serviceTypeId: string): string {
  const v = serviceTypeId.toLowerCase();
  if (v.includes("nail")) return "Nails";
  if (v.includes("facial")) return "Facial";
  if (v.includes("makeup")) return "Facial";
  if (v.includes("hair")) return "Hair";
  return "Hair";
}

/* ------------------------------ IMAGE MAPPER ------------------------------ */
function getServiceImage(serviceTypeId: string) {
  const v = serviceTypeId.toLowerCase();
  if (v.includes("nail")) return manicureImg;
  if (v.includes("facial")) return facialImg;
  if (v.includes("makeup")) return facialImg;
  if (v.includes("hair")) return haircutImg;
  return massageImg;
}

/* ------------------------------ MAIN SCREEN ------------------------------ */
export default function SalesScreen() {
  const router = useRouter();
  const { setCustomer, setServices } = useBooking();

  /* ---------- API SERVICES ---------- */
  const [services, setServicesApi] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------- UI STATE ---------- */
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  /* ---------- CUSTOMER ---------- */
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });

  /* ---------------- LOAD SERVICES ---------------- */
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const res = await ProductService.searchProduct("", "1", "50");
        setServicesApi(res.list || []);
      } catch {
        Alert.alert("Error", "Unable to load services");
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  /* ---------------- FILTER SERVICES ---------------- */
  const filteredServices =
    selectedCategory === "All"
      ? services
      : services.filter(
          (s) => mapServiceToCategory(s.serviceTypeId) === selectedCategory
        );

  /* ---------------- CART ---------------- */
  const toggleSelectService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const totalAmount = selectedServices.reduce((acc, id) => {
    const s = services.find((x) => x.id === id);
    return acc + (s?.price ?? 0);
  }, 0);

  /* ---------------- VIEW ORDER ---------------- */
  const vieworder = () => {
    if (!selectedCustomer) return;

    const selectedServiceObjects = services
      .filter((s) => selectedServices.includes(s.id))
      .map((s) => ({
        id: s.id,
        title: s.name,
        price: s.price,
      }));

    setServices(selectedServiceObjects);

    const phone = Number(
      String(selectedCustomer.phone || "").replace(/\D/g, "")
    );
    setCustomer({ ...selectedCustomer, phone });

    router.push("/order-summary");
  };

  /* ---------------- ADD CUSTOMER ---------------- */
  const handleSaveCustomer = () => {
    if (!newCustomer.name.trim()) return;

    setSelectedCustomer({
      name: newCustomer.name.trim(),
      email: newCustomer.email.trim(),
      phone: newCustomer.phone.trim(),
    });

    setShowAddCustomer(false);
  };

  /* ---------------- UI ---------------- */
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        {/* ---------- HEADER (ADD + CART) ---------- */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              if (selectedCustomer) {
                // Edit existing customer
                setNewCustomer({
                  name: selectedCustomer.name,
                  email: selectedCustomer.email,
                  phone: String(selectedCustomer.phone || ""),
                });
              }
              setShowAddCustomer(true);
            }}
          >
            <Ionicons
              name={selectedCustomer ? "person-outline" : "person-add-outline"}
              size={18}
              color="#111827"
            />
            <Text style={styles.addButtonText}>
              {selectedCustomer ? selectedCustomer.name : "Add Customer"}
            </Text>
          </TouchableOpacity>

          {/* CART */}
          <TouchableOpacity style={styles.cart}>
            <Ionicons name="cart-outline" size={22} color="#111827" />
            {selectedServices.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartCount}>{selectedServices.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

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

        {loading && (
          <Text
            style={{ textAlign: "center", marginTop: 20, color: "#6B7280" }}
          >
            Loading services...
          </Text>
        )}

        {/* Services */}
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
                  if (!selectedCustomer) {
                    Alert.alert(
                      "Customer Required",
                      "Please add customer details before selecting a service."
                    );
                    return;
                  }

                  toggleSelectService(item.id);
                }}
                style={[
                  styles.card,
                  isSelected && styles.cardSelected,
                  !selectedCustomer && styles.cardDisabled,
                ]}
              >
                <Image
                  source={getServiceImage(item.serviceTypeId)}
                  style={styles.cardImage}
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <View>
            <Text style={styles.itemCount}>
              {selectedServices.length} items
            </Text>
            <Text style={styles.totalText}>
              Total:{" "}
              <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.viewOrderButton,
              (!selectedCustomer || selectedServices.length === 0) && {
                backgroundColor: "#E5E7EB",
              },
            ]}
            disabled={!selectedCustomer || selectedServices.length === 0}
            onPress={vieworder}
          >
            <Text style={styles.viewOrderText}>View Order</Text>
          </TouchableOpacity>
        </View>

        {/* Add Customer Modal */}
        <Modal visible={showAddCustomer} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                {selectedCustomer ? "Edit Customer" : "Add Customer"}
              </Text>

              <TextInput
                placeholder="Name"
                value={newCustomer.name}
                onChangeText={(t) =>
                  setNewCustomer({ ...newCustomer, name: t })
                }
                style={styles.modalInput}
              />
              <TextInput
                placeholder="Email"
                value={newCustomer.email}
                onChangeText={(t) =>
                  setNewCustomer({ ...newCustomer, email: t })
                }
                style={styles.modalInput}
              />
              <TextInput
                placeholder="Phone"
                keyboardType="phone-pad"
                value={newCustomer.phone}
                onChangeText={(t) =>
                  setNewCustomer({ ...newCustomer, phone: t })
                }
                style={styles.modalInput}
              />

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveCustomer}
              >
                <Text style={styles.saveButtonText}>Save</Text>
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /* ---------- HEADER ---------- */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  addButtonText: {
    marginLeft: 6,
    fontWeight: "500",
    color: colors.textPrimary,
  },

  cart: { position: "relative" },

  cartBadge: {
    position: "absolute",
    right: -6,
    top: -4,
    backgroundColor: "#DC2626",
    borderRadius: 10,
    paddingHorizontal: 5,
  },

  cartCount: {
    color: "#FFFFFF",
    fontSize: 10,
  },

  /* ---------- CATEGORIES ---------- */
  categoryContainer: {
    flexDirection: "row",
    marginTop: 12,
    marginHorizontal: 16,
  },

  categoryButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },

  activeCategory: {
    backgroundColor: colors.primary,
  },

  categoryText: {
    color: colors.textSecondary,
  },

  activeCategoryText: {
    color: colors.onPrimary,
    fontWeight: "600",
  },

  /* ---------- SERVICES ---------- */
  serviceList: {
    padding: 16,
    paddingBottom: 120,
  },

  card: {
    width: "48%",
    backgroundColor: colors.background,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  cardSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
  },

  cardDisabled: {
    opacity: 0.5,
  },

  cardImage: {
    width: "100%",
    height: 130,
  },

  cardContent: {
    padding: 8,
  },

  cardTitle: {
    fontWeight: "500",
    color: colors.textPrimary,
  },

  cardPrice: {
    color: colors.textSecondary,
  },

  /* ---------- SUMMARY ---------- */
  summaryContainer: {
    position: "absolute",
    bottom: 70,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },

  itemCount: {
    color: colors.textSecondary,
  },

  totalText: {
    fontWeight: "500",
    color: colors.textPrimary,
  },

  totalAmount: {
    fontWeight: "700",
    color: colors.textPrimary,
  },

  viewOrderButton: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },

  viewOrderText: {
    fontWeight: "600",
    color: colors.primary,
  },

  /* ---------- MODAL ---------- */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: "88%",
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: colors.textPrimary,
  },

  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },

  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  saveButtonText: {
    fontWeight: "600",
    color: colors.onPrimary,
  },
});


