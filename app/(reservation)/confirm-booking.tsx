import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConfirmBooking() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  const bookingDetails = {
    service: "Massage",
    staff: "Emma Johnson",
    date: "Tue, Oct 21, 2025",
    time: "09:00",
    customerName: "David",
    customerPhone: "15213131321",
    total: "$120",
  };

  const handleConfirm = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleBack = () => {
    router.push("/customer-details");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Confirm Booking</Text>
            <Text style={styles.stepText}>Step 5 of 5</Text>
          </View>

          <View style={styles.divider} />

          {/* Booking Details */}
          <View style={styles.card}>
            {[
              {
                icon: "sparkles-outline",
                label: "Service",
                value: bookingDetails.service,
              },
              {
                icon: "person-outline",
                label: "Staff",
                value: bookingDetails.staff,
              },
              {
                icon: "calendar-outline",
                label: "Date",
                value: bookingDetails.date,
              },
              {
                icon: "time-outline",
                label: "Time",
                value: bookingDetails.time,
              },
              {
                icon: "person-circle-outline",
                label: "Customer",
                value: bookingDetails.customerName,
                subValue: bookingDetails.customerPhone,
              },
            ].map((item, index, arr) => (
              <View key={index}>
                <View style={styles.detailBlock}>
                  <View style={styles.row}>
                    <Ionicons
                      name={item.icon as any}
                      size={18}
                      color="#9C9C9C"
                      style={styles.icon}
                    />
                    <Text style={styles.label}>{item.label}</Text>
                  </View>
                  <Text style={styles.value}>{item.value}</Text>
                  {item.subValue && (
                    <Text style={styles.subValue}>{item.subValue}</Text>
                  )}
                </View>
                {index < arr.length - 1 && <View style={styles.innerDivider} />}
              </View>
            ))}

            <View style={styles.innerDivider} />
            <View style={styles.totalBlock}>
              <Text style={[styles.label, { fontWeight: "600" }]}>Total</Text>
              <Text style={[styles.value, { fontWeight: "600" }]}>
                {bookingDetails.total}
              </Text>
            </View>
          </View>

          {/* Booking Confirmation Note */}
          <View style={styles.noteCard}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#BFA78A"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.noteTitle}>Booking Confirmation</Text>
            </View>
            <Text style={styles.noteText}>
              Please review all details before confirming the reservation. A
              confirmation SMS will be sent to the customer.
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleConfirm}
            >
              <Text style={styles.continueText}>Confirm Booking</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* ✅ Popup Modal */}
        {/* ✅ Compact success popup */}
        <Modal
          transparent
          visible={showPopup}
          animationType="fade"
          onRequestClose={handleClosePopup}
        >
          <View style={styles.popupOverlay}>
            <View style={styles.toastBox}>
              <View style={styles.toastContent}>
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color="#2ECC71"
                  style={styles.toastIcon}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.toastTitle}>Reservation confirmed!</Text>
                  <Text style={styles.toastMessage}>
                    {bookingDetails.customerName}'s appointment has been booked
                    successfully.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 10 },
  title: { fontSize: 22, fontWeight: "700", color: "#222" },
  stepText: { fontSize: 14, color: "#9B9B9B", marginTop: 4 },
  divider: { height: 1, backgroundColor: "#E8E8E8", marginVertical: 14 },
  card: {
    backgroundColor: "#F8F7F7",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    marginBottom: 20,
  },
  detailBlock: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  icon: { marginRight: 6 },
  label: {
    fontSize: 15,
    color: "#555",
  },
  value: {
    fontSize: 15,
    color: "#111",
    fontWeight: "500",
    marginLeft: 24,
  },
  subValue: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
    marginLeft: 24,
  },
  innerDivider: {
    height: 1,
    backgroundColor: "#E4E4E4",
    marginVertical: 8,
  },
  totalBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  noteCard: {
    backgroundColor: "#FAF9F8",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E2DB",
    padding: 14,
    marginBottom: 30,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  noteText: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
    lineHeight: 20,
  },
  footer: {
    marginTop: "auto",
  },
  continueButton: {
    backgroundColor: "#BFA78A",
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: "center",
  },
  continueText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  backText: {
    color: "#B0A698",
    fontSize: 16,
    fontWeight: "500",
  },

  // ✅ Popup styles
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  toastBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignSelf: "stretch", // 👈 fills available width
    marginHorizontal: 20, // 👈 matches ScrollView padding (same as Booking Details)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  toastContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  toastIcon: {
    marginRight: 10,
  },
  toastTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222",
    marginBottom: 2,
  },
  toastMessage: {
    fontSize: 14,
    color: "#444",
    flexShrink: 1,
  },
});
