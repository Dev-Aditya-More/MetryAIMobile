import { AuthService } from "@/api/auth";
import { colors } from "@/theme/colors";
import { handleError } from "@/utils/handleError";
import { PickedImage, pickImage, uploadImage } from "@/utils/pickImage";
import { getFromSecureStore, saveToSecureStore } from "@/utils/secureStorage";
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

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = Math.min(
  420,
  Math.max(320, Math.floor(Math.min(width, 900) * 0.48))
);

export default function ProfileSetup() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<PickedImage | null>(null);

  // --- Validation Logic
  const canContinue = useMemo(
    () =>
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      countryCode.trim().length > 0 &&
      phone.trim().length >= 6,
    [firstName, lastName, countryCode, phone]
  );

  // --- Upload Button
  const onUploadPress = async () => {
    const img = await pickImage();
    if (img) setImage(img);

    const uploadedData = await uploadImage(img);
    setAvatarUri(uploadedData.data.url);
  };

  // --- Continue Handler
  const onContinue = async () => {
    if (!canContinue) {
      Alert.alert(
        "Incomplete",
        "Please fill all required fields before continuing."
      );
      return;
    }

    Keyboard.dismiss();
    setLoading(true);

    try {
      // Getting UserId
      const userid = await getFromSecureStore("id");
      console.log(userid);

      let fullname = `${firstName.trim()} ${lastName.trim()}`.trim();
      let phoneCode = countryCode.trim();
      let phoneNumber = phone.trim();
      let avatarUrl = avatarUri ?? "";
      const payload = {
        fullName: fullname,
        avatarUrl: avatarUrl,
        phoneCode: phoneCode,
        phone: phoneNumber,
      };
      // Call API
      await AuthService.setupProfile(payload);

      // Save onboarding completion flags

      saveToSecureStore({ onboarding_completed: "true" });

      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      if (fullName) {
        saveToSecureStore({ customer_name: fullName });
      }
      // Navigate to home
      router.replace("/merchant/(home)" as Href);
    } catch (err) {
      const message = handleError(err);
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
                  <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backBtn}
                  >
                    <FontAwesome name="angle-left" size={18} color="#374151" />
                    <Text style={styles.backText}>Back</Text>
                  </TouchableOpacity>

                  <View style={styles.progressWrap}>
                    <Text style={styles.stepText}>Step 3 of 5</Text>
                    <View style={styles.progressBarTrack}>
                      <View
                        style={[styles.progressBarFill, { width: "60%" }]}
                      />
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
                          <Image
                            source={{ uri: avatarUri }}
                            style={styles.avatarImage}
                          />
                        ) : (
                          <FontAwesome name="user" size={28} color="#A8B3C2" />
                        )}
                        <View style={styles.uploadBadge}>
                          <FontAwesome name="camera" size={12} color="#fff" />
                        </View>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.heading}>Complete Your Profile</Text>
                    <Text style={styles.subheading}>
                      Tell us about yourself
                    </Text>
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
  screen: {
    flex: 1,
    backgroundColor: colors.primarySoft,
  },

  wrapper: {
    flex: 1,
  },

  centerColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  outerScrollContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
  },

  card: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 12,
    alignItems: "stretch",
    borderWidth: 1,
    borderColor: colors.border,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  backBtn: {
    flexDirection: "row",
    alignItems: "center",
  },

  backText: {
    marginLeft: 8,
    color: colors.textSecondary,
    fontSize: 14,
  },

  progressWrap: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },

  stepText: {
    fontSize: 12,
    color: colors.muted,
    textAlign: "right",
  },

  progressBarTrack: {
    height: 8,
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginTop: 8,
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primaryDark,
  },

  innerScroll: {
    flex: 1,
  },

  contentInner: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },

  titleWrap: {
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  avatarArea: {
    marginBottom: 12,
  },

  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  avatarImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },

  uploadBadge: {
    position: "absolute",
    right: -6,
    bottom: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 6,
  },

  subheading: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
  },

  form: {
    paddingTop: 18,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  field: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },

  label: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },

  input: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
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
    backgroundColor: colors.primaryDark,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  continueDisabled: {
    opacity: 0.5,
  },

  continueText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
