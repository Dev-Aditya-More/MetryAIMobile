import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const services = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&h=600&q=80", // Hair Salon
    title: "Hair Salon",
    duration: "60 min",
    price: "$65",
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&h=600&q=80", // Massage
    title: "Massage",
    duration: "45 min",
    price: "$75",
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&h=600&q=80", // Facial
    title: "Facial",
    duration: "60 min",
    price: "$85",
  },
  {
    id: "4",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&h=600&q=80", // Manicure
    title: "Manicure",
    duration: "90 min",
    price: "$120",
  },
];

export default function SelectService() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = () => {
    if (selected) router.replace("/(reservation)/select-staff");
    console.log("Selected service ID:", selected);
  };

  const handleCancel = () => {
    setSelected(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Select Service</Text>
        <Text style={styles.stepText}>Step 1 of 5</Text>
      </View>

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
              style={[
                styles.card,
                isSelected && {
                  borderColor: "#bfa78a",
                  backgroundColor: "#f7f4f0",
                },
              ]}
              activeOpacity={0.8}
              onPress={() => setSelected(item.id)}
            >
              {/* Service Image */}
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                contentFit="cover"
                cachePolicy="disk"
              />

              {/* Service Info */}
              <View style={styles.info}>
                <Text style={styles.serviceTitle}>{item.title}</Text>
                <Text style={styles.details}>{item.duration}</Text>
                <Text style={styles.details}>{item.price}</Text>
              </View>

              {/* Checkmark icon for selected item */}
              {isSelected && (
                <MaterialIcons name="check-circle" size={24} color="#bfa78a" />
              )}
            </TouchableOpacity>
          );
        }}
      />

      {/* Buttons */}
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
  list: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    marginBottom: 12,
    padding: 10,
    backgroundColor: "#fff",
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
    color: "#222",
  },
  details: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },
  radioDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#bfa78a",
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
  cancelBtn: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  cancelText: {
    color: "#444",
    fontSize: 16,
    fontWeight: "500",
  },
});
