import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const CARD_MAX_WIDTH = Math.min(1200, Math.max(560, width - 80));
const DIGITS = 6;
const START_SECONDS = 272; // 4:32

export default function OtpEmail() {
  const router = useRouter();
  const params = useLocalSearchParams() as { email?: string };
  const email = (params?.email as string) ?? "sumit12@email.com";

  const [digits, setDigits] = useState<string[]>(Array(DIGITS).fill(""));
  const inputsRef = useRef<Array<TextInput | null>>([]);
  const [secondsLeft, setSecondsLeft] = useState<number>(START_SECONDS);
  const [sending, setSending] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // responsive OTP box sizing
  const CARD_HORIZONTAL_PADDING = 80; // match card paddingHorizontal
  const GAP = 12;
  const effectiveCardWidth = Math.min(width, CARD_MAX_WIDTH);
  const available = Math.max(240, effectiveCardWidth - CARD_HORIZONTAL_PADDING);
  const otpBoxSize = Math.max(36, Math.floor((available - GAP * (DIGITS - 1)) / DIGITS));
  const otpFontSize = Math.max(16, Math.floor(otpBoxSize * 0.45));

  useEffect(() => {
    const t = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    // focus first input shortly after mount so layout is ready
    setTimeout(() => inputsRef.current[0]?.focus(), 200);
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const handleInputChange = (text: string, index: number) => {
    if (/[^0-9]/.test(text)) return;
    const copy = [...digits];
    copy[index] = text.slice(-1);
    setDigits(copy);
    if (text && index < DIGITS - 1) inputsRef.current[index + 1]?.focus();
    else if (index === DIGITS - 1) Keyboard.dismiss();
  };

  const handleKeyPress = (e: any, index: number) => {
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

  const handleResendOtp = () => {
    if (secondsLeft > 0) return;
    setDigits(Array(DIGITS).fill(""));
    setSecondsLeft(START_SECONDS);
    Alert.alert("Resent", "A new OTP has been sent to your email.");
  };

  const handleVerify = () => {
    const code = digits.join("");
    if (code.length !== DIGITS) {
      return Alert.alert("Invalid code", "Please enter the complete OTP.");
    }
    // simulate verify -> go to signup next step
    setSending(true);
    setTimeout(() => {
      setSending(false);
      Keyboard.dismiss();
      router.push("/profile-setup");
    }, 800);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.wrapper}
        >
          <View style={[styles.card, { maxWidth: CARD_MAX_WIDTH, minHeight: Math.max(560, height - 160) }]}>
            <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
              <FontAwesome name="angle-left" size={18} color="#374151" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.logoWrap}>
              <View style={styles.logoCircle} />
              <Text style={styles.title}>Check Your Email</Text>
              <Text style={styles.subtitle}>We've sent a verification code to</Text>
              <Text style={styles.emailText}>{email}</Text>
            </View>

            <View style={[styles.otpContainer, { width: available }]}>
              {Array.from({ length: DIGITS }).map((_, i) => (
                <TextInput
                  key={i}
                  ref={(el) => { inputsRef.current[i] = el; }}
                  value={digits[i]}
                  onChangeText={(t) => handleInputChange(t, i)}
                  onKeyPress={(e) => handleKeyPress(e, i)}
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
                />
              ))}
            </View>

            <Text style={styles.timerLine}>
              Code expires in <Text style={styles.timerValue}>{formatTimer(secondsLeft)}</Text>
            </Text>

            <TouchableOpacity
              style={styles.resendRow}
              onPress={handleResendOtp}
              disabled={secondsLeft > 0}
            >
              <FontAwesome name="refresh" size={14} color={secondsLeft > 0 ? "#9AA3AD" : "#111827"} />
              <Text style={[styles.resendText, secondsLeft > 0 && styles.resendDisabled]}>
                {"  "}Resend code
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleVerify}
              style={[styles.verifyBtn, sending && { opacity: 0.7 }]}
              disabled={sending}
            >
              <Text style={styles.verifyText}>{sending ? "Verifying..." : "Verify & Continue"}</Text>
            </TouchableOpacity>

            <Text style={styles.bottomText}>
              Didn't receive the code? <Text style={styles.hint}>
                Check your spam folder</Text>
            </Text>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#EAF6FB" },
  wrapper: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24, paddingVertical: 24 },

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

  backRow: { position: "absolute", left: 20, top: 18, flexDirection: "row", alignItems: "center", zIndex: 2 },
  backText: { marginLeft: 8, color: "#374151", fontSize: 14 },

  logoWrap: { alignItems: "center", marginBottom: 18 },
  logoCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#2F3B47", marginBottom: 12 },
  title: { fontSize: 22, fontWeight: "700", color: "#111827", marginBottom: 6 },
  subtitle: { fontSize: 13, color: "#6B7280", marginBottom: 6 },
  emailText: { fontWeight: "700", color: "#111827", marginBottom: 18 },

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

  resendRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  resendText: { color: "#111827", marginLeft: 6 },
  resendDisabled: { color: "#9AA3AD" },

  keyboardDismissBtn: { alignSelf: "center", marginTop: 6, backgroundColor: "#EFF6F9", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  keyboardDismissText: { color: "#6B7280", fontSize: 13 },

  verifyBtn: { width: "100%", backgroundColor: "#F97316", borderRadius: 10, paddingVertical: 14, alignItems: "center", marginTop: 12 },
  verifyText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  bottomText: { marginTop: 18, color: "#6B7280", textAlign: "center" },
  hint: { color: "#111827", fontWeight: "600" },
});