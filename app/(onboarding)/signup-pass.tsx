// this is screen the signup methode for taking email and password

import { AuthService } from "@/api/auth";
import { handleError } from "@/utils/handleError";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
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

const { width } = Dimensions.get("window");

export default function SignupScreen() {
  const [input, setInput] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [userType, setUserType] = useState<"customber" | "business">("business");

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const signinPreesed = () => {
    router.push("/(onboarding)/login");
  };

 
  const handleContinue = async () => {
    // ✅ Basic input validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (input.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      if (userType == "business"){
      setError("");

      const data = await AuthService.signup("user",input.email, input.password);

      console.log("✅ Signup successful:", data);

      Keyboard.dismiss();

      router.push({
        pathname: "/(onboarding)/profile-setup",
        params: { email: input.email, type: userType },
      });
    }else{
      // implement the customber signup
    }
    } catch (err) {
      let message = handleError(err);
      setError(message);
    }
  };

  const handleSocialPress = (platform: string) => {
    Alert.alert(
      `${platform} pressed`,
      "You can integrate actual SDK here later!"
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
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
              <Text style={styles.sectionText}>
                Create your account to get started
              </Text>
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

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialPress("Apple")}
              >
                <View style={styles.socialInner}>
                  <FontAwesome name="apple" size={18} color="#111" />
                  <Text style={styles.socialText}>Continue with Apple</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.separatorRow}>
                <View style={styles.sepLine} />
                <View style={styles.sepPill}>
                  <Text style={styles.sepText}>Or sign up with email</Text>
                </View>
                <View style={styles.sepLine} />
              </View>

              {/* User Type Toggle */}
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    userType === "customber"
                      ? styles.toggleActive
                      : styles.toggleInactive,
                  ]}
                  onPress={() => setUserType("customber")}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      userType === "customber" && styles.toggleTextActive,
                    ]}
                  >
                    Customber
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    userType === "business"
                      ? styles.toggleActive
                      : styles.toggleInactive,
                  ]}
                  onPress={() => setUserType("business")}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      userType === "business" && styles.toggleTextActive,
                    ]}
                  >
                    Business
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Email Field */}
              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>Email</Text>
                <TextInput
                  placeholder="Enter your email address"
                  value={input.email}
                  keyboardType="email-address"
                  onChangeText={(text) =>
                    setInput((prev) => ({ ...prev, email: text }))
                  }
                  style={styles.input}
                  autoCapitalize="none"
                  placeholderTextColor="#9aa3ad"
                  returnKeyType="next"
                />
              </View>

              {/* Password Field */}
              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>Password</Text>
                <TextInput
                  placeholder="Enter your password"
                  value={input.password}
                  onChangeText={(text) =>
                    setInput((prev) => ({ ...prev, password: text }))
                  }
                  style={styles.input}
                  secureTextEntry
                  placeholderTextColor="#9aa3ad"
                  returnKeyType="done"
                />
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <TouchableOpacity
                style={styles.continueBtn}
                onPress={handleContinue}
              >
                <Text style={styles.continueText}>Continue</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={signinPreesed}>
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
  brand: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.6,
  },
  tagline: { fontSize: 13, color: "#6B7280", marginTop: 6 },
  sectionText: {
    fontSize: 15,
    color: "#374151",
    marginTop: 14,
    marginBottom: 8,
  },

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
  socialInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  socialText: { marginLeft: 10, fontSize: 15, color: "#111827" },

  separatorRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 14,
  },
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
