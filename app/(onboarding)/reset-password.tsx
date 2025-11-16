import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthService } from "../../utils/auth";

export default function ResetPassword() {
  const [input, setInput] = useState({
    password: "",
    confirm: "",
  });

  const [loading, setLoading] = useState(false);

 const handleSubmit = async () => {
  if (!input.password || !input.confirm) {
    Alert.alert("Missing Fields", "Please fill in all fields.");
    return;
  }

  if (input.password !== input.confirm) {
    Alert.alert("Mismatch", "Passwords do not match.");
    return;
  }

  try {
    setLoading(true);
    Keyboard.dismiss();

    const { data, error } = await AuthService.updatePassword(input.password);

    // 🔥 CHECK FOR ERROR BEFORE SHOWING SUCCESS
    if (error) {
      Alert.alert("Error", error.message || "Unable to reset password.");
      return;
    }

    Alert.alert(
      "Password Updated",
      "Your password has been successfully reset.",
      [{ text: "Done", onPress: () => router.push("/(onboarding)/signup-pass") }]
    );

  } catch (err) {
    Alert.alert("Error", "Something went wrong.");
  } finally {
    setLoading(false);
  }
};


  return (
    <SafeAreaView style={styles.screen}>
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.wrapper}
        >
          <View style={styles.card}>
            <Text style={styles.title}>Reset Your Password</Text>
            <Text style={styles.subtitle}>
              Enter your new password below to complete the reset.
            </Text>

            {/* Password Field */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>New Password</Text>
              <TextInput
                placeholder="Enter new password"
                secureTextEntry
                onChangeText={(text) =>
                  setInput((prev) => ({ ...prev, password: text }))
                }
                autoCapitalize="none"
                placeholderTextColor="#9aa3ad"
                style={styles.input}
              />
            </View>

            {/* Confirm Password */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Confirm Password</Text>
              <TextInput
                placeholder="Re-enter password"
                secureTextEntry
                onChangeText={(text) =>
                  setInput((prev) => ({ ...prev, confirm: text }))
                }
                autoCapitalize="none"
                placeholderTextColor="#9aa3ad"
                style={styles.input}
              />
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[styles.resetBtn, loading && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.resetText}>
                {loading ? "Updating..." : "Reset Password"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace("/login")}>
              <Text style={styles.backText}>← Back to Login</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#EAF6FB",
  },
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  card: {
    width: "100%",
    backgroundColor: "#F2FAFF",
    borderRadius: 8,
    paddingVertical: 36,
    paddingHorizontal: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  fieldWrap: {
    alignSelf: "stretch",
    marginBottom: 16,
  },
  fieldLabel: {
    color: "#374151",
    marginBottom: 6,
    fontSize: 13,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E6EEF6",
  },
  resetBtn: {
    width: "100%",
    backgroundColor: "#F97316",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#F97316",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  resetText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  backText: {
    color: "#007AFF",
    marginTop: 16,
    fontWeight: "600",
    fontSize: 14,
  },
});
