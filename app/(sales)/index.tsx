import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet } from "react-native";
import BottomNav from "@/components/BottomNav";

export default function SalesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}> 
        <Text style={styles.title}>Welcome to Sales</Text>
        <Text style={styles.subtitle}>This is a placeholder screen.</Text>
      </View>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "700", color: "#111827" },
  subtitle: { marginTop: 6, color: "#6B7280" },
});


