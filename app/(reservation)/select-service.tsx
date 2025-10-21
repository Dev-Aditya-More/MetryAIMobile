import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const services = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&h=600&q=80",
    title: "Hair Salon",
    duration: "60 min",
    price: "$65",
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&h=600&q=80",
    title: "Massage",
    duration: "45 min",
    price: "$75",
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&h=600&q=80",
    title: "Facial",
    duration: "60 min",
    price: "$85",
  },
  {
    id: "4",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&h=600&q=80",
    title: "Manicure",
    duration: "90 min",
    price: "$120",
  },
];

export default function SelectService() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = () => {
    if (selected) router.push("/select-staff");
  };

  const handleCancel = () => setSelected(null);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Select Service</Text>
        <Text style={styles.stepText}>Step 1 of 5</Text>
      </View>

      <View style={styles.divider} />

      {/* Service List */}
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isSelected = item.id === selected;
          return (
            <TouchableOpacity
              style={[styles.card, isSelected && styles.cardSelected]}
              activeOpacity={0.8}
              onPress={() => setSelected(item.id)}
            >
              {/* Checkmark on selected */}
              {isSelected && (
                <View style={styles.checkIcon}>
                  <MaterialIcons
                    name="check-circle"
                    size={22}
                    color="#BFA78A"
                  />
                </View>
              )}

              {/* Image */}
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                contentFit="cover"
                cachePolicy="disk"
              />

              {/* Info */}
              <View style={styles.info}>
                <Text style={styles.serviceTitle}>{item.title}</Text>
                <Text style={styles.details}>{item.duration}</Text>
                <Text style={styles.details}>{item.price}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueBtn, !selected && styles.disabledBtn]}
          disabled={!selected}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1C1C1C",
  },
  stepText: {
    fontSize: 14,
    color: "#8C8C8C",
    marginTop: 4,
  },
  list: {
    paddingBottom: 30,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 14,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardSelected: {
    backgroundColor: "#F5F0EB",
    borderColor: "#BFA78A",
  },
  checkIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  image: {
    width: width * 0.18,
    height: width * 0.18,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E2C2C",
  },
  details: {
    fontSize: 14,
    color: "#6E6E6E",
    marginTop: 2,
  },
  footer: {
    marginTop: "auto",
  },
  continueBtn: {
    backgroundColor: "#BFA78A",
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: "center",
  },
  disabledBtn: {
    backgroundColor: "#E0E0E0",
  },
  continueText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  cancelText: {
    color: "#7A7A7A",
    fontSize: 16,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5", // light gray line
    marginVertical: 10,
  },
});
