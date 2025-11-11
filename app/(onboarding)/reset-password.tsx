import { StyleSheet, Text, View } from "react-native";

export default function ResetPassword() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Sojo!</Text>
      <Text style={styles.body}>
        We're excited to have you join us. Please sign up with your email to get started.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  body: { fontSize: 16, color: "#666", textAlign: "center" },
});
