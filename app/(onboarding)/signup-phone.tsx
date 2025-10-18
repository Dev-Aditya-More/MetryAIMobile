import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
  Keyboard,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function SignupScreen() {
  const [mode, setMode] = useState<"phone" | "email">("phone");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleContinue = () => {
    if (mode === "phone") {
      if (!/^[0-9]{10}$/.test(input)) {
        setError("Please enter a valid 10-digit phone number");
        return;
      }
      router.push({ pathname: "/(onboarding)/otp-phone", params: { phone: input } });
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
        setError("Please enter a valid email address");
        return;
      }
      router.push({ pathname: "/(onboarding)/otp-email", params: { email: input } });
    }
    setError("");
    Keyboard.dismiss();
  };

  const handleSocialPress = (platform: string) => {
    Alert.alert(`${platform} pressed`, "You can integrate actual SDK here later!");
  };

  const toggleMode = (selected: "phone" | "email") => {
    setMode(selected);
    setInput("");
    setError("");
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Pressable allows tapping the empty space to dismiss keyboard */}
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.wrapper}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.card}>
            <View style={styles.logoArea}>
              <View style={styles.logoCircle} />
              <Text style={styles.brand}>SOJO</Text>
              <Text style={styles.tagline}>Book your style, anytime.</Text>
              <Text style={styles.sectionText}>Create your account to get started</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialPress("Google")}
              >
                <View style={styles.socialInner}>
                  <FontAwesome name="google" size={18} color="#DB4437" />
                  <Text style={styles.socialText}>Continue with Google</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialPress("Apple")}>
                <View style={styles.socialInner}>
                  <FontAwesome name="apple" size={18} color="#111" />
                  <Text style={styles.socialText}>Continue with Apple</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.separatorRow}>
                <View style={styles.sepLine} />
                <View style={styles.sepPill}>
                  <Text style={styles.sepText}>Or continue with</Text>
                </View>
                <View style={styles.sepLine} />
              </View>

              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[styles.toggleButton, mode === "email" && styles.toggleInactive]}
                  onPress={() => toggleMode("email")}
                >
                  <Text style={[styles.toggleText, mode === "email" && styles.toggleTextActive]}>
                    <FontAwesome name="envelope-o" size={14} />{"  "}Email
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.toggleButton, mode === "phone" && styles.toggleActive]}
                  onPress={() => toggleMode("phone")}
                >
                  <Text style={[styles.toggleText, mode === "phone" && styles.toggleTextActive]}>
                    <FontAwesome name="phone" size={14} />{"  "}Phone
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>{mode === "phone" ? "Phone Number" : "Email"}</Text>
                <TextInput
                  placeholder={mode === "phone" ? "Enter your phone number" : "Enter your email address"}
                  value={input}
                  keyboardType={mode === "phone" ? "phone-pad" : "email-address"}
                  onChangeText={setInput}
                  style={styles.input}
                  autoCapitalize="none"
                  placeholderTextColor="#9aa3ad"
                  returnKeyType="done"
                />
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
                <Text style={styles.continueText}>Continue</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => Alert.alert("Sign In Pressed")}>
                <Text style={styles.footer}>
                  Already have an account?{" "}
                  <Text style={styles.linkText}>Sign in</Text>
                </Text>
              </TouchableOpacity>

              <Text style={styles.terms}>
                By continuing, you agree to our{" "}
                <Text style={styles.linkText}>Terms of Service</Text> and{" "}
                <Text style={styles.linkText}>Privacy Policy</Text>.
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#EAF6FB" },

  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },

  card: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F2FAFF",
    borderRadius: 8,
    paddingVertical: 32,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 4,
  },

  logoArea: { alignItems: "center", marginBottom: 14 },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#2F3B47",
    marginBottom: 12,
  },
  brand: { fontSize: 22, fontWeight: "700", color: "#111827", letterSpacing: 0.6 },
  tagline: { fontSize: 13, color: "#6B7280", marginTop: 6 },
  sectionText: { fontSize: 15, color: "#374151", marginTop: 14, marginBottom: 8 },

  actions: { width: "100%", marginTop: 8, alignItems: "center" },
  socialButton: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#E6EEF6",
  },
  socialInner: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  socialText: { marginLeft: 10, fontSize: 15, color: "#111827" },

  separatorRow: { flexDirection: "row", alignItems: "center", width: "100%", marginVertical: 14 },
  sepLine: { flex: 1, height: 1, backgroundColor: "#D1D9E0" },
  sepPill: {
    paddingHorizontal: 12,
    backgroundColor: "#F2FAFF",
    alignItems: "center",
    justifyContent: "center",
  },
  sepText: { color: "#6B7280", fontSize: 13 },

  toggleContainer: {
    flexDirection: "row",
    alignSelf: "stretch",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#E6EEF6",
    overflow: "hidden",
    marginBottom: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleActive: { backgroundColor: "#ffffff" },
  toggleInactive: { backgroundColor: "#F8FBFD" },
  toggleText: { fontSize: 14, color: "#6B7280" },
  toggleTextActive: { color: "#111827", fontWeight: "600" },

  fieldWrap: { alignSelf: "stretch", marginTop: 4 },
  fieldLabel: { color: "#374151", marginBottom: 6, fontSize: 13 },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E6EEF6",
  },

  // keyboard dismiss small button
  keyboardDismissBtn: {
    alignSelf: "flex-end",
    marginTop: 8,
    backgroundColor: "#EFF6F9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  keyboardDismissText: { color: "#6B7280", fontSize: 13 },

  error: { color: "#D14343", marginTop: 6, alignSelf: "flex-start" },

  continueBtn: {
    width: "100%",
    backgroundColor: "#F97316",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 18,
    shadowColor: "#F97316",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  continueText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  footer: { marginTop: 16, color: "#374151", textAlign: "center" },
  linkText: { color: "#F97316", fontWeight: "600" },
  terms: { marginTop: 10, fontSize: 12, textAlign: "center", color: "#9AA3AD" },
});
