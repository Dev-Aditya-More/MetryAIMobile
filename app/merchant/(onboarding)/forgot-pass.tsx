
import { colors } from "@/theme/colors";
import { router, useLocalSearchParams } from "expo-router";
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
import { AuthService } from "../../../api/auth";


export default function ForgotPass() {
  const { email } = useLocalSearchParams();

  const [input, setInput] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      Keyboard.dismiss();

      const { data, error } = await AuthService.resetPassword(input.email);

      if (error) {
        Alert.alert("Error", error.message || "Unable to send reset email.");
        return;
      }

      Alert.alert(
        "Reset Link Sent",
        `A password reset link has been sent to ${input.email}`
      );

    } catch (err) {
      Alert.alert("Error", "Something went wrong, please try again.");
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
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Enter your registered email below and we&apos;ll send you a password
              reset link.
            </Text>

            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Email</Text>
              <TextInput
                placeholder="Enter your email address"
                onChangeText={(text) =>
                  setInput((prev) => ({ ...prev, email: text }))
                }
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9aa3ad"
                style={styles.input}
              />
            </View>

            <TouchableOpacity
              style={[styles.resetBtn, loading && { opacity: 0.7 }]}
              onPress={handleReset}
              disabled={loading}
            >
              <Text style={styles.resetText}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()}>
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
    backgroundColor: colors.background,
  },

  wrapper: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },

  fieldWrap: {
    marginBottom: 16,
  },

  fieldLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },

  input: {
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
  },

  resetBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },

  resetText: {
    color: colors.onPrimary,
    fontWeight: "700",
    fontSize: 16,
  },

  backText: {
    color: colors.accentBlue,
    marginTop: 18,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14,
  },
});
