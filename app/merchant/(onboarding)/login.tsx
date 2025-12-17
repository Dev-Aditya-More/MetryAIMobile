// this is the login screen
import { colors } from "@/theme/colors";
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
import { AuthService } from "../../../api/auth";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const [input, setInput] = useState({ email: "shahviraj030@gmail.com", password: "123456" });
  const [error, setError] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [userType, setUserType] = useState<"customer" | "business">(
    "business"
  );

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

  const handleContinue = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (input.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      if (userType == "business") {
        setError("");

        let data = await AuthService.login(input.email, input.password);

        Keyboard.dismiss();

        console.log("✅ login successful:", data);

        router.push({
          pathname: "/merchant/(home)",
          params: { email: input.email },
        });
      } else {
        // Implement customer login
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
                  <Text style={styles.sepText}>Or sign in with email</Text>
                </View>
                <View style={styles.sepLine} />
              </View>

              {/* User Type Toggle */}
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    userType === "customer"
                      ? styles.toggleActive
                      : styles.toggleInactive,
                  ]}
                  onPress={() => setUserType("customer")}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      userType === "customer" && styles.toggleTextActive,
                    ]}
                  >
                    Customer
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

              {/* Forgot Password */}
              <TouchableOpacity onPress={() => router.push("/merchant/(onboarding)/forgot-pass")}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <TouchableOpacity
                style={styles.continueBtn}
                onPress={handleContinue}
              >
                <Text style={styles.continueText}>Continue</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push("/merchant/(onboarding)/signup-pass")}>
                <Text style={styles.footer}>
                  Don&apos;t have an account?{" "}
                  <Text style={styles.linkText}>SignUp</Text>
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
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

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
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: 32,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  /* Logo */
  logoArea: {
    alignItems: "center",
    marginBottom: 14,
  },

  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primarySoft,
    marginBottom: 12,
  },

  brand: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: 0.6,
  },

  tagline: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
  },

  sectionText: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 14,
    marginBottom: 8,
  },

  /* Actions */
  actions: {
    width: "100%",
    marginTop: 8,
    alignItems: "center",
  },

  socialButton: {
    width: "100%",
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingVertical: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },

  socialInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  socialText: {
    marginLeft: 10,
    fontSize: 15,
    color: colors.textPrimary,
  },

  /* Separator */
  separatorRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 14,
  },

  sepLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },

  sepPill: {
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  sepText: {
    color: colors.textSecondary,
    fontSize: 13,
  },

  /* Toggle */
  toggleContainer: {
    flexDirection: "row",
    alignSelf: "stretch",
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginBottom: 12,
  },

  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  toggleActive: {
    backgroundColor: colors.primarySoft,
  },

  toggleInactive: {
    backgroundColor: colors.background,
  },

  toggleText: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  toggleTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },

  /* Fields */
  fieldWrap: {
    alignSelf: "stretch",
    marginTop: 4,
  },

  fieldLabel: {
    color: colors.textSecondary,
    marginBottom: 6,
    fontSize: 13,
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

  error: {
    color: "#DC2626",
    marginTop: 6,
    alignSelf: "flex-start",
    fontSize: 13,
  },

  /* Buttons */
  continueBtn: {
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 18,
  },

  continueText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },

  forgotText: {
    alignSelf: "flex-end",
    color: colors.accentBlue,
    fontWeight: "500",
    marginTop: 4,
    marginBottom: 16,
  },

  footer: {
    marginTop: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },

  linkText: {
    color: colors.primary,
    fontWeight: "600",
  },

  terms: {
    marginTop: 10,
    fontSize: 12,
    textAlign: "center",
    color: colors.muted,
  },
});
