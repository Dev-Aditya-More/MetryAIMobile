//services.reduce((acc, s) => acc + s.price, 0)
// the above function is higher order with callback funciton
// callback functions is (acc, s) => acc + s.price, 0
import profileImg from "@/assets/images/profile.jpg";
import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBooking } from "./context/SalesContext";

export default function OrderSummary() {
  const router = useRouter();

  const { booking, updateServices, resetBooking } = useBooking();

  const customer = { ...booking.customerDetails, image: profileImg };

  const [services, setServices] = useState([
    { id: "1", title: "Haircut", price: 50.0 },
    { id: "2", title: "Hair Coloring", price: 80.0 },
    { id: "3", title: "Hair Treatment", price: 60.0 },
  ]);

  useEffect(() => {
    if (booking.services?.length) {
      setServices(booking.services);
      console.log("Booking Service Details:", booking.services);
      console.log("customer Service Details:", booking.customerDetails);
    }
    console.log("Booking Service Details:", booking.services);
    console.log("customer Service Details:", booking.customerDetails);
  }, [booking.services]);

  const handleRemoveService = (id: string) => {
    const updatedServices = services.filter((s) => s.id !== id);
    if (services.length === 1) {
      // If only one service left, remove & redirect (existing behavior)
      setServices([]);
      resetBooking();
      router.push("/merchant/(sales)");
    } else {
      setServices((prev) => prev.filter((s) => s.id !== id));
      updateServices(updatedServices);
    }
  };

  const handleSend = () => {
    // your existing send flow
    console.log("id", booking.services);
    router.push("/merchant/(sales)/order-sent");
  };

  const handleCancel = () => {
    // Clear services and go back (or redirect to desired route)
    setServices([]);
    resetBooking();
    // Use router.back() to go to previous screen, or router.push('/') to go home
    router.push("/merchant/(sales)");
  };

  const subtotal = services.reduce((acc, s) => acc + s.price, 0);
  const total = subtotal;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.title}>Order Summary</Text>
        <Text style={styles.subtitle}>
          Review your selected items and proceed to payment
        </Text>

        {/* Customer Info */}
        <View style={styles.customerBox}>
          <Text style={styles.sectionLabel}>Customer</Text>
          <View style={styles.customerRow}>
            <Image source={customer.image} style={styles.avatar} />
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{customer.name}</Text>
              <Text style={styles.customerEmail}>{customer.email}</Text>
              <Text style={styles.customerPhone}>{customer.phone}</Text>
            </View>
          </View>
        </View>

        {/* Services List */}
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.serviceBox}>
              <View style={styles.serviceRow}>
                <View>
                  <Text style={styles.serviceName}>{item.title}</Text>
                  <Text style={styles.serviceType}>service</Text>
                </View>
                <View style={styles.priceSection}>
                  <Text style={styles.servicePrice}>
                    ${item.price.toFixed(2)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveService(item.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityLabel={`Remove ${item.title}`}
                  >
                    <Ionicons name="close-outline" size={18} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.noServices}>No services selected</Text>
          }
          // ensure list doesn't consume entire space so totals/buttons show
          style={{ marginBottom: 8 }}
        />

        {/* Totals */}
        {services.length > 0 && (
          <View style={styles.totalBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabelBold}>Total</Text>
              <Text style={styles.totalValueBold}>${total.toFixed(2)}</Text>
            </View>
          </View>
        )}

        {/* Buttons: Send (primary) + Cancel (secondary) */}
        {/* Buttons: Send (primary) + Cancel (below) */}
        {services.length > 0 ? (
          <View style={styles.buttonsColumn}>
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Ionicons name="send-outline" size={16} color="#fff" />
              <Text style={styles.sendButtonText}>Send to Front Desk</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              accessibilityLabel="Cancel order"
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // If no services, show a single 'Back' button to navigate back
          <TouchableOpacity
            style={styles.cancelOnlyButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelOnlyButtonText}>Back</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },

  /* ---------------- CUSTOMER ---------------- */
  customerBox: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  sectionLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },

  customerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
  },

  customerInfo: {
    flex: 1,
  },

  customerName: {
    fontWeight: "600",
    color: colors.textPrimary,
    fontSize: 15,
  },

  customerEmail: {
    color: colors.textSecondary,
    fontSize: 13,
  },

  customerPhone: {
    color: colors.textSecondary,
    fontSize: 13,
  },

  /* ---------------- SERVICES ---------------- */
  serviceBox: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 10,
  },

  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  serviceName: {
    fontWeight: "500",
    color: colors.textPrimary,
  },

  serviceType: {
    color: colors.muted,
    fontSize: 13,
  },

  priceSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  servicePrice: {
    fontSize: 15,
    color: colors.textPrimary,
    marginRight: 4,
  },

  /* ---------------- TOTALS ---------------- */
  totalBox: {
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: 12,
    marginBottom: 16,
    marginTop: 10,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  totalLabel: {
    color: colors.textSecondary,
    fontSize: 15,
  },

  totalValue: {
    color: colors.textPrimary,
    fontSize: 15,
  },

  totalLabelBold: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 16,
  },

  totalValueBold: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 16,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },

  /* ---------------- BUTTONS ---------------- */
  buttonsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  buttonsColumn: {
    flexDirection: "column",
    gap: 12,
  },

  cancelOnlyButton: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 8,
  },

  cancelOnlyButtonText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "600",
  },

  sendButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
  },

  sendButtonText: {
    color: colors.onPrimary,
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 15,
  },

  cancelButton: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "600",
  },

  noServices: {
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: 20,
    fontSize: 15,
  },
});

