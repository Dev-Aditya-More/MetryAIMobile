import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SalesScreen from ".";
import { useBooking } from "./context/SalesContext";

export default function OrderSent() {
  const router = useRouter();
 const {booking} = useBooking()

  const order = {
    id: "#ORD-529540",
    customer: booking.customerDetails?.name,
    // services: [
    //   { name: "Haircut", staff: "Emily Chen", price: 50.0 },
    //   { name: "Manicure", staff: "Emily Chen", price: 35.0 },
    // ],
    services:booking.services,
    total: 91.8,
  };

 


  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Background (Sales Screen behind modal) */}
      <SalesScreen />

      {/* Fullscreen Modal Overlay */}
      <View style={styles.overlay}>
        <View style={styles.popup}>
          {/* Top Checkmark Circle */}
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={32} color="#fff" />
          </View>

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.push("/")}
          >
            <Ionicons name="close-outline" size={26} color="#111" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>Order Sent!</Text>
          <Text style={styles.subtitle}>
            Your order has been sent to the front desk
          </Text>

          {/* Order Details */}
          <View style={styles.orderBox}>
            <View style={styles.row}>
              <Text style={styles.label}>Order ID</Text>
              <Text style={styles.value}>{order.id}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Customer</Text>
              <Text style={styles.valueBold}>{order.customer}</Text>
            </View>

            <View style={styles.divider} />

            <Text style={[styles.label, { marginBottom: 8 }]}>
              Services & Staff
            </Text>
            {order.services.map((s) => (
              <View key={s.title} style={styles.serviceRow}>
                <View>
                  <Text style={styles.serviceName}>{s.title}</Text>
                  {/* <Text style={styles.staff}>{s.staff}</Text> */}
                </View>
                <Text style={styles.servicePrice}>${s.price.toFixed(2)}</Text>
              </View>
            ))}

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
            </View>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Please proceed to the front desk when ready.{"\n"}
              Payment will be processed there.
            </Text>
          </View>

          {/* Done Button */}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => router.push("/")}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  popup: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: "flex-start",
    position: "absolute",
    bottom: 0,
  },

  checkCircle: {
    backgroundColor: "#C5B9A1",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: -35,
    zIndex: 10,
  },

  closeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    zIndex: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginTop: 16,
  },

  subtitle: {
    color: "#6B7280",
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 16,
  },

  orderBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    width: "100%",
    padding: 14,
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  label: { color: "#6B7280", fontSize: 14 },
  value: { color: "#111827", fontSize: 14, fontWeight: "500" },
  valueBold: { color: "#111827", fontWeight: "700", fontSize: 15 },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },

  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  serviceName: { fontWeight: "500", color: "#111827", fontSize: 15 },
  staff: { color: "#9CA3AF", fontSize: 13 },
  servicePrice: { color: "#111827", fontSize: 15 },

  totalLabel: { fontWeight: "600", color: "#111827" },
  totalValue: { fontWeight: "700", color: "#111827", fontSize: 16 },

  infoBox: {
    backgroundColor: "#FAFAF9",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 16,
    width: "100%",
  },

  infoText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 20,
  },

  doneButton: {
    backgroundColor: "#C5B9A1",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: "auto", // Push button to bottom
  },

  doneButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
