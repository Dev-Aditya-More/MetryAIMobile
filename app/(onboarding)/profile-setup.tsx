import { handleError } from "@/utils/handleError";
import { FontAwesome } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../constants/api";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = Math.min(420, Math.max(320, Math.floor(Math.min(width, 900) * 0.48)));

export default function ProfileSetup() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- Validation Logic
  const canContinue = useMemo(
    () =>
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      countryCode.trim().length > 0 &&
      phone.trim().length >= 6,
    [firstName, lastName, countryCode, phone]
  );

  // --- Profile API Call
  const profileSetup = async () => {
    return api.post("/auth/complete-profile", {
      user_id:"e359157c-697a-4a34-8c1f-97c3732865a2",
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      // avatar_url can be included here later if you upload it to Supabase storage
    });
  };

  // --- Upload Button
  const onUploadPress = () => {
    Alert.alert(
      "Upload",
      "Image upload not implemented in this mock.\nYou can integrate ImagePicker later."
    );
  };

  // --- Continue Handler
  const onContinue = async () => {
    if (!canContinue) {
      Alert.alert("Incomplete", "Please fill all required fields before continuing.");
      return;
    }

    Keyboard.dismiss();
    setLoading(true);

    try {
      // Save onboarding completion flags
      const SecureStore =
        (require("expo-secure-store") as any).default ||
        require("expo-secure-store");

      await SecureStore.setItemAsync?.("onboarding_completed", "true");

      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      if (fullName) {
        await SecureStore.setItemAsync?.("customer_name", fullName);
      }

      // Call API
      await profileSetup();

      // Navigate to home
      router.replace("/(home)" as Href);
    } catch (err) {
      const message = handleError(err)
      console.error("message:", err);
      Alert.alert("Error", "Something went wrong while saving your profile.");
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
          <View style={styles.centerColumn}>
            <ScrollView
              contentContainerStyle={styles.outerScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={[
                  styles.card,
                  { width: CARD_WIDTH, minHeight: Math.min(900, height - 120) },
                ]}
              >
                {/* header: back + progress */}
                <View style={styles.headerRow}>
                  <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <FontAwesome name="angle-left" size={18} color="#374151" />
                    <Text style={styles.backText}>Back</Text>
                  </TouchableOpacity>

                  <View style={styles.progressWrap}>
                    <Text style={styles.stepText}>Step 3 of 5</Text>
                    <View style={styles.progressBarTrack}>
                      <View style={[styles.progressBarFill, { width: "60%" }]} />
                    </View>
                  </View>
                </View>

                {/* scrollable content inside card */}
                <ScrollView
                  style={styles.innerScroll}
                  contentContainerStyle={styles.contentInner}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.titleWrap}>
                    <View style={styles.avatarArea}>
                      <TouchableOpacity
                        onPress={onUploadPress}
                        style={styles.avatarCircle}
                        accessibilityLabel="Upload avatar"
                      >
                        {avatarUri ? (
                          <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                        ) : (
                          <FontAwesome name="user" size={28} color="#A8B3C2" />
                        )}
                        <View style={styles.uploadBadge}>
                          <FontAwesome name="camera" size={12} color="#fff" />
                        </View>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.heading}>Complete Your Profile</Text>
                    <Text style={styles.subheading}>Tell us about yourself</Text>
                  </View>

                  {/* form */}
                  <View style={styles.form}>
                    {/* First and Last Name */}
                    <View style={styles.row}>
                      <View style={styles.field}>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput
                          value={firstName}
                          onChangeText={setFirstName}
                          placeholder="First name"
                          style={styles.input}
                          returnKeyType="next"
                          placeholderTextColor="#cbd5e1"
                        />
                      </View>

                      <View style={styles.field}>
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput
                          value={lastName}
                          onChangeText={setLastName}
                          placeholder="Last name"
                          style={styles.input}
                          returnKeyType="done"
                          placeholderTextColor="#cbd5e1"
                        />
                      </View>
                    </View>

                    {/* Country Code and Phone */}
                    <View style={{ marginTop: 16 }}>
                      <Text style={styles.label}>Phone Number</Text>
                      <View style={styles.phoneRow}>
                        <TextInput
                          value={countryCode}
                          onChangeText={setCountryCode}
                          style={[styles.input, styles.countryCodeInput]}
                          keyboardType="phone-pad"
                          placeholder="+91"
                          maxLength={5}
                          placeholderTextColor="#cbd5e1"
                        />
                        <TextInput
                          value={phone}
                          onChangeText={setPhone}
                          style={[styles.input, styles.phoneInput]}
                          keyboardType="phone-pad"
                          placeholder="1234567890"
                          placeholderTextColor="#cbd5e1"
                        />
                      </View>
                    </View>

                    <View style={{ height: 18 }} />

                    {/* Continue Button */}
                    <TouchableOpacity
                      style={[
                        styles.continueBtn,
                        !canContinue && styles.continueDisabled,
                      ]}
                      onPress={onContinue}
                      activeOpacity={0.8}
                      disabled={!canContinue || loading}
                    >
                      <Text style={styles.continueText}>
                        {loading ? "Please wait..." : "Continue"}
                      </Text>
                    </TouchableOpacity>

                    <View style={{ height: 28 }} />
                  </View>
                </ScrollView>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Pressable>
    </SafeAreaView>
  );
}

/* ------------------------------ STYLES ------------------------------ */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#EAF6FB" },
  wrapper: { flex: 1 },
  centerColumn: { flex: 1, alignItems: "center", justifyContent: "center" },
  outerScrollContent: { alignItems: "center", justifyContent: "center", paddingVertical: 28 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 12,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 6,
    overflow: "hidden",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  backBtn: { flexDirection: "row", alignItems: "center" },
  backText: { marginLeft: 8, color: "#374151", fontSize: 14 },
  progressWrap: { flex: 1, marginLeft: 8, marginRight: 8 },
  stepText: { fontSize: 12, color: "#9AA3AD", textAlign: "right" },
  progressBarTrack: {
    height: 8,
    backgroundColor: "#EEF2F6",
    borderRadius: 8,
    marginTop: 8,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", backgroundColor: "#1F2937" },

  innerScroll: { flex: 1 },
  contentInner: { paddingHorizontal: 20, paddingBottom: 8 },

  titleWrap: {
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F6F9",
  },
  avatarArea: { marginBottom: 12 },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#F3F8FF",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatarImage: { width: 84, height: 84, borderRadius: 42 },
  uploadBadge: {
    position: "absolute",
    right: -6,
    bottom: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: { fontSize: 20, fontWeight: "700", color: "#111827", marginTop: 6 },
  subheading: { fontSize: 13, color: "#6B7280", marginTop: 6 },

  form: { paddingTop: 18 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  field: { flex: 1, minWidth: 0, marginRight: 8 },
  label: { fontSize: 12, color: "#6B7280", marginBottom: 6 },
  input: {
    backgroundColor: "#F8FAFB",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    color: "#111827",
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  countryCodeInput: {
    flex: 0.3,
    textAlign: "center",
  },
  phoneInput: {
    flex: 0.7,
  },
  continueBtn: {
    marginTop: 18,
    backgroundColor: "#F97316",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  continueDisabled: { opacity: 0.6 },
  continueText: { color: "#fff", fontWeight: "700" },
});
