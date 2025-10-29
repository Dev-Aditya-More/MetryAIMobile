import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrderSummary() {
  return (
    <SafeAreaView>
    <View style={styles.container}>
      <Text style={styles.title}>OrderSent</Text>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  body: { fontSize: 16, color: "#666", textAlign: "center" },
});
