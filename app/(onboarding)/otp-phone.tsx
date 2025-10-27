import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const CARD_MAX_WIDTH = Math.min(1200, Math.max(560, width - 80)); // responsive max width
const DIGITS = 4; // changed to 4 so OTP row fits responsively
const START_SECONDS = 272; // 4:32

export default function OtpPhone() {
  const router = useRouter();
  const params = useLocalSearchParams() as { phone?: string };
  const rawPhone = (params?.phone as string) ?? "+81 xxxxxx2341";

  const [digits, setDigits] = useState(Array(DIGITS).fill(""));
  const inputsRef = useRef<Array<TextInput | null>>([]);
  const [secondsLeft, setSecondsLeft] = useState(START_SECONDS);
  const [sending, setSending] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // calculate OTP box size responsively so it never overflows
  const CARD_HORIZONTAL_PADDING = 80; // card paddingLeft + paddingRight (approx)
  const GAP = 12;
  const effectiveCardWidth = Math.min(width, CARD_MAX_WIDTH);
  const available = Math.max(200, effectiveCardWidth - CARD_HORIZONTAL_PADDING); // leave room for margins
  const otpBoxSize = Math.max(36, Math.floor((available - GAP * (DIGITS - 1)) / DIGITS));
  const otpFontSize = Math.max(16, Math.floor(otpBoxSize * 0.42));

  useEffect(() => {
    const t = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    // focus first input on mount (defer slightly so layout completes)
    setTimeout(() => inputsRef.current[0]?.focus(), 250);
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const maskPhone = (phone: string) => {
    const digitsOnly = phone.replace(/\D/g, "");
    const last4 = digitsOnly.slice(-4);
    const maskedLen = Math.max(0, digitsOnly.length - 4);
    const masked = "•".repeat(maskedLen) + last4;
    // preserve leading plus if present
    const hasPlus = phone.trim().startsWith("+");
    return hasPlus ? `+${masked}` : masked;
  };

  const onChange = (index: number, text: string) => {
    if (!text) {
      const copy = [...digits];
      copy[index] = "";
      setDigits(copy);
      return;
    }
    const ch = text[text.length - 1];
    if (!/^[0-9]$/.test(ch)) return;
    const copy = [...digits];
    copy[index] = ch;
    setDigits(copy);
    if (index < DIGITS - 1) {
      inputsRef.current[index + 1]?.focus();
    } else {
      Keyboard.dismiss();
    }
  };

  const onKeyPress = (index: number, e: any) => {
    if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
      const copy = [...digits];
      copy[index - 1] = "";
      setDigits(copy);
    }
  };

  const formatTimer = (s: number) => {
    const mm = Math.floor(s / 60).toString();
    const ss = (s % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const handleResend = async () => {
    if (secondsLeft > 0) return;
    setSending(true);
    // simulate resend
    setTimeout(() => {
      setSending(false);
      setSecondsLeft(START_SECONDS);
      Alert.alert("Code resent", "A new OTP has been sent to your phone.");
    }, 800);
  };

  const handleVerify = () => {
    const code = digits.join("");
    if (code.length < DIGITS) {
      Alert.alert("Invalid code", "Please enter the complete OTP.");
      return;
    }
    Keyboard.dismiss();
    router.push("/(onboarding)/profile-setup");
  };

  const handleBack = () => router.back();

  return (
    <SafeAreaView style={styles.screen}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={styles.wrapper}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View
            style={[
              styles.card,
              { maxWidth: CARD_MAX_WIDTH, minHeight: Math.max(560, height - 160) },
            ]}
          >
            <TouchableOpacity style={styles.backRow} onPress={handleBack} accessibilityLabel="Back">
              <FontAwesome name="angle-left" size={18} color="#374151" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.logoWrap}>
              <View style={styles.logoCircle} />
              <Text style={styles.title}>Check Your Phone</Text>
              <Text style={styles.subtitle}>We've sent a verification code to</Text>
              <Text style={styles.phoneText}>{maskPhone(rawPhone)}</Text>
            </View>

            {/* changed code: use same otprow as otp-email */}
            <View style={[styles.otpContainer, { width: available }]}>
              {Array.from({ length: DIGITS }).map((_, i) => (
                <TextInput
                  key={i}
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  value={digits[i]}
                  onChangeText={(t) => onChange(i, t)}
                  onKeyPress={(e) => onKeyPress(i, e)}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={[
                    styles.otpBox,
                    {
                      width: otpBoxSize,
                      height: otpBoxSize,
                      fontSize: otpFontSize,
                      marginRight: i < DIGITS - 1 ? GAP : 0,
                    },
                  ]}
                  textAlign="center"
                  placeholder=""
                  placeholderTextColor="#cbd5e1"
                  returnKeyType={i === DIGITS - 1 ? "done" : "next"}
                  importantForAutofill="no"
                />
              ))}
            </View>
            {/* changed code */}

            <Text style={styles.timerLine}>
              Code expires in <Text style={styles.timerValue}>{formatTimer(secondsLeft)}</Text>
            </Text>

            <TouchableOpacity
              style={styles.resendRow}
              onPress={handleResend}
              disabled={secondsLeft > 0 || sending}
              accessibilityState={{ disabled: secondsLeft > 0 || sending }}
            >
              <FontAwesome
                name="refresh"
                size={14}
                color={secondsLeft > 0 || sending ? "#9AA3AD" : "#111827"}
              />
              <Text
                style={[
                  styles.resendText,
                  secondsLeft > 0 || sending ? styles.resendDisabled : null,
                ]}
              >
                {"  "}Resend code
              </Text>
            </TouchableOpacity>

            {keyboardVisible && (
              <TouchableOpacity style={styles.keyboardDismissBtn} onPress={() => Keyboard.dismiss()}>
                <Text style={styles.keyboardDismissText}>Hide keyboard</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.verifyBtn}
              onPress={handleVerify}
              accessibilityLabel="Verify and continue"
            >
              <Text style={styles.verifyText}>Verify & Continue</Text>
            </TouchableOpacity>

            <Text style={styles.bottomText}>Didn't receive the code?</Text>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#EAF6FB" },

  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },

  card: {
    width: "100%",
    backgroundColor: "#F2FAFF",
    borderRadius: 10,
    paddingVertical: 36,
    paddingHorizontal: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 6,
  },

  backRow: {
    position: "absolute",
    left: 20,
    top: 18,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 2,
  },
  backText: { marginLeft: 8, color: "#374151", fontSize: 14 },

  logoWrap: { alignItems: "center", marginBottom: 18 },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#2F3B47",
    marginBottom: 12,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#111827", marginBottom: 6 },
  subtitle: { fontSize: 13, color: "#6B7280", marginBottom: 4 },
  phoneText: { fontWeight: "700", color: "#111827", marginBottom: 18 },

  otpContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 12 },
  otpBox: {
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderColor: "#E6EEF6",
    borderWidth: 1,
    color: "#111827",
    padding: 0,
    textAlignVertical: "center",
  },

  timerLine: { color: "#6B7280", marginTop: 6, marginBottom: 8 },
  timerValue: { color: "#D14343", fontWeight: "700" },

  resendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  resendText: { color: "#111827", marginLeft: 6 },
  resendDisabled: { color: "#9AA3AD" },

  keyboardDismissBtn: {
    alignSelf: "center",
    marginTop: 6,
    backgroundColor: "#EFF6F9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  keyboardDismissText: { color: "#6B7280", fontSize: 13 },

  verifyBtn: {
    width: "100%",
    backgroundColor: "#F97316",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  verifyText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  bottomText: { marginTop: 18, color: "#6B7280" },
});