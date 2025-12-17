import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBooking } from "./context/ReservationContext";

const { width } = Dimensions.get("window");

export default function CustomerDetails() {

  const { booking, updateCustomerDetails, resetAfterDateTime } = useBooking();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Popup state
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    if (booking.customerDetails) {
      setName(booking.customerDetails.name);
      setPhone(booking.customerDetails.phone.toString());
    }
  }, [booking.customerDetails])

  const showPopup = (message: React.SetStateAction<string>) => {
    setPopupMessage(message);
    setPopupVisible(true);
  };

  // Mock reservation details
  const reservation = {
    service: booking.service?.title || "N/A",
    staff: booking.staff?.name || "N/A",
    date: booking.date || "N/A",
    time: booking.time || "N/A",
  };

  const isContinueEnabled = name.trim() !== "" && phone.trim() !== "";

  const handleContinue = () => {
    if (!isContinueEnabled) {
      showPopup("Please enter both name and phone number.");
      return;
    }

    const cleanedPhone = phone.replace(/\D/g, ""); // remove non-digit characters

    if (cleanedPhone.length !== 10) {
      showPopup("Please enter a valid 10-digit phone number.");
      return;
    }

    updateCustomerDetails({
      name: name.trim(),
      email: "",
      phone: Number(cleanedPhone),
    });

    router.push("/merchant/(reservation)/confirm-booking");
  };

  const handleBack = () => {
    resetAfterDateTime();
    router.push("/merchant/(reservation)/select-date-time");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Popup Modal */}
      <Modal
        visible={popupVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPopupVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>{popupMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setPopupVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
            <Text style={styles.title}>Customer Details</Text>
            <Text style={styles.stepText}>Step 4 of 5</Text>
          </View>

          <View style={styles.divider} />

          {/* Form Section */}
          <View style={styles.formSection}>
            <Text style={styles.label}>Customer Name</Text>
            <TextInput
              placeholder="Enter customer name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholderTextColor="#999"
            />

            <Text style={[styles.label, { marginTop: 18 }]}>Phone Number</Text>
            <TextInput
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.divider} />

          {/* Summary Section */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service:</Text>
              <Text style={styles.summaryValue}>{reservation.service}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Staff:</Text>
              <Text style={styles.summaryValue}>{reservation.staff}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date:</Text>
              <Text style={styles.summaryValue}>{reservation.date}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Time:</Text>
              <Text style={styles.summaryValue}>{reservation.time}</Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                !isContinueEnabled && styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
            >
              <Text
                style={[
                  styles.continueText,
                  !isContinueEnabled && styles.continueTextDisabled,
                ]}
              >
                Continue
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: { marginBottom: 16 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
  },
  stepText: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 14,
  },
  formSection: { marginBottom: 20 },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F6F5F7",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 15,
    color: "#222",
  },
  summaryCard: {
    backgroundColor: "#F6F5F7",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    padding: 14,
    marginBottom: 30,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 15,
    color: "#555",
  },
  summaryValue: {
    fontSize: 15,
    color: "#111",
    fontWeight: "500",
  },
  footer: { marginTop: "auto" },
  continueButton: {
    backgroundColor: "#BFA78A",
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: "center",
  },
  continueButtonDisabled: { backgroundColor: "#E5E1DC" },
  continueText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  continueTextDisabled: { color: "#C7C1B9" },
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

  // Popup Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#FFF",
    padding: 25,
    borderRadius: 10,
    alignItems: "center",
    width: "75%",
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: "#BFA78A",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 6,
  },
  modalButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
});
