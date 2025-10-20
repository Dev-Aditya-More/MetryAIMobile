import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type Staff = {
  id: string;
  name: string;
  specialty: string;
};

export default function SelectStaff() {
  const router = useRouter();
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [showList, setShowList] = useState(false);
  const [showSelectedCard, setShowSelectedCard] = useState(false);

  const staffList: Staff[] = [
    { id: "1", name: "Emma Johnson", specialty: "Professional Specialist" },
    { id: "2", name: "Michael Brown", specialty: "Hair Stylist" },
    { id: "3", name: "Sophia Williams", specialty: "Massage Therapist" },
    { id: "4", name: "Olivia Davis", specialty: "Facial Expert" },
  ];

  // When user taps dropdown again after selecting someone
  const toggleDropdown = () => {
    if (showSelectedCard) {
      // Hide card and reopen list
      setShowSelectedCard(false);
      setShowList(true);
    } else {
      setShowList((prev) => !prev);
    }
  };

  const handleSelect = (item: Staff) => {
    setShowList(false);
    // Show selected card after short delay
    setTimeout(() => {
      setSelectedStaff(item);
      setShowSelectedCard(true);
    }, 400);
  };

  const handleContinue = () => {
    if (selectedStaff) {
      router.push("/select-date-time");
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => showList && setShowList(false)}>
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Select Staff</Text>
            <Text style={styles.stepText}>Step 2 of 5</Text>
          </View>

          {/* Label */}
          <Text style={styles.label}>Choose your preferred staff member</Text>

          {/* Dropdown or Selected Card */}
          <>
            {/* Dropdown Field */}
            <TouchableOpacity
              style={styles.dropdown}
              onPress={toggleDropdown}
              activeOpacity={0.8}
            >
              <Text style={styles.dropdownText}>
                {selectedStaff ? selectedStaff.name : "Select staff member"}
              </Text>
              <MaterialIcons
                name={showList ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={22}
                color="#999"
              />
            </TouchableOpacity>

            {/* Dropdown List */}
            {showList && (
              <View style={styles.dropdownList}>
                <FlatList
                  data={staffList}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.staffItem}
                      onPress={() => handleSelect(item)}
                    >
                      <Text style={styles.staffName}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

            {/* Selected Staff Card */}
            {showSelectedCard && (
              <View style={styles.selectedCard}>
                <View style={styles.staffInfo}>
                  <View style={styles.avatarContainer}>
                    <MaterialIcons name="person" size={36} color="#bfa78a" />
                  </View>
                  <View>
                    <Text style={styles.staffNameSelected}>
                      {selectedStaff?.name}
                    </Text>
                    <Text style={styles.specialtySelected}>
                      {selectedStaff?.specialty}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.continueBtn, !selectedStaff && styles.disabledBtn]}
              disabled={!selectedStaff}
              onPress={handleContinue}
            >
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
  },
  stepText: {
    fontSize: 14,
    color: "#999",
    marginTop: 2,
  },
  label: {
    fontSize: 15,
    color: "#555",
    marginBottom: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    color: "#555",
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    marginTop: 6,
    backgroundColor: "#fff",
    maxHeight: 200,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  staffItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  staffName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  selectedCard: {
    backgroundColor: "#f7f4f0",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#eee",
    marginTop: 8,
  },
  staffInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  staffNameSelected: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  specialtySelected: {
    fontSize: 14,
    color: "#777",
  },
  footer: {
    marginTop: "auto",
  },
  continueBtn: {
    backgroundColor: "#bfa78a",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  disabledBtn: {
    backgroundColor: "#ddd",
  },
  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backBtn: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  backText: {
    color: "#444",
    fontSize: 16,
    fontWeight: "500",
  },
});
