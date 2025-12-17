import profieImg from "@/assets/images/profile.jpg";
import BottomNav from "@/components/BottomNav";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileImageContainer}>
        <Image source={profieImg} style={styles.profileImage} />
        <Text>viraj</Text>
      </View>

      <View>
        <Text style={styles.sectionTitle}>Personal</Text>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionItem}>Profile</Text>
          <Text style={styles.sectionItem}>General</Text>
          <Text style={styles.sectionItem}>Security</Text>
        </View>
      </View>

      <View>
        <Text style={styles.sectionTitle}>WORKSPACE</Text>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionItem}>Staff Management</Text>
          <Text style={styles.sectionItem}>Notifications</Text>
        </View>
      </View>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 📍 Section title (like "Personal")
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 15,
  },
  sectionContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    margin: 15, // outer
    padding: 10, // inner
  },
  sectionItem: {
    fontSize: 16,
    margin: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  profileImage: { width: 120, height: 120, borderRadius: 60 },
  profileImageContainer: {
    width: "100%",
    height: "20%", // Adjusted height for spacing
    justifyContent: "center", // Vertical center
    alignItems: "center", // Horizontal center
    backgroundColor: "#f0f0f0", // Light gray background for visibility
  },
  container: { flex: 1, backgroundColor: "#FFFFFF" },
});
