import { StyleSheet, Text, View } from "react-native";

export default function OrderSummary() {
  return (

    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>
    </View>


  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  body: { fontSize: 16, color: "#666", textAlign: "center" },
});
