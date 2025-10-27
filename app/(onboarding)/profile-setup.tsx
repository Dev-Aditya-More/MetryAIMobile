import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Pressable,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter, router } from "expo-router";

const { width, height } = Dimensions.get("window");
// Card width: responsive — narrow on phones, moderate on tablets / large screens
const CARD_WIDTH = Math.min(420, Math.max(320, Math.floor(Math.min(width, 900) * 0.48)));

const SERVICES = [
  "Haircut & Styling",
  "Hair Coloring",
  "Spa & Wellness",
  "Manicure & Pedicure",
  "Facial Treatments",
  "Massage Therapy",
  "Eyebrow & Lashes",
  "Makeup Services",
];

export default function ProfileSetup() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<string | null>(null);
  const [showGenderOptions, setShowGenderOptions] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const canContinue = useMemo(
    () =>
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      gender !== null &&
      selectedServices.length >= 1,
    [firstName, lastName, gender, selectedServices]
  );

  const toggleService = (s: string) => {
    setSelectedServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const onUploadPress = () => {
    Alert.alert("Upload", "Image upload not implemented in this mock.\nUse camera or gallery integration.");
  };

  const onContinue = () => {
    if (!canContinue) {
      return Alert.alert("Incomplete", "Please fill required fields and select at least one service.");
    }
    
    // Dismiss keyboard and navigate to reservation flow
    Keyboard.dismiss();
    
    // Navigate to the reservation flow after onboarding completion
    router.push("/(reservation)/select-service" as any);
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
              <View style={[styles.card, { width: CARD_WIDTH, minHeight: Math.min(900, height - 120) }]}>
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

                {/* scrollable content inside card so header remains visible on small screens */}
                <ScrollView
                  style={styles.innerScroll}
                  contentContainerStyle={styles.contentInner}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.titleWrap}>
                    <View style={styles.avatarArea}>
                      <TouchableOpacity onPress={onUploadPress} style={styles.avatarCircle} accessibilityLabel="Upload avatar">
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
                    <Text style={styles.subheading}>Tell us about yourself and your preferences</Text>
                  </View>

                  {/* form */}
                  <View style={styles.form}>
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

                    <View style={{ marginTop: 12 }}>
                      <Text style={styles.label}>Gender</Text>
                      <TouchableOpacity
                        style={styles.select}
                        onPress={() => setShowGenderOptions((s) => !s)}
                        activeOpacity={0.9}
                      >
                        <Text style={[styles.selectText, !gender && { color: "#9AA3AD" }]}>
                          {gender ?? "Select your gender"}
                        </Text>
                        <FontAwesome name="sort-down" size={18} color="#9AA3AD" />
                      </TouchableOpacity>

                      {showGenderOptions && (
                        <View style={styles.options}>
                          {["Male", "Female", "Non-binary", "Prefer not to say"].map((g) => (
                            <TouchableOpacity
                              key={g}
                              style={styles.optionRow}
                              onPress={() => {
                                setGender(g);
                                setShowGenderOptions(false);
                                Keyboard.dismiss();
                              }}
                            >
                              <Text style={styles.optionText}>{g}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>

                    <View style={{ marginTop: 16 }}>
                      <Text style={styles.label}>Services You're Interested In</Text>
                      <Text style={styles.helper}>Select all that apply (minimum 1)</Text>

                      <View style={styles.chipsWrap}>
                        {SERVICES.map((s) => {
                          const active = selectedServices.includes(s);
                          return (
                            <TouchableOpacity
                              key={s}
                              onPress={() => toggleService(s)}
                              style={[styles.chip, active && styles.chipActive]}
                              activeOpacity={0.9}
                            >
                              <Text style={[styles.chipText, active && styles.chipTextActive]}>{s}</Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>

                    <View style={{ height: 18 }} />

                    <TouchableOpacity
                      style={[styles.continueBtn, !canContinue && styles.continueDisabled]}
                      onPress={onContinue}
                      activeOpacity={0.9}
                      disabled={!canContinue}
                    >
                      <Text style={styles.continueText}>Continue</Text>
                    </TouchableOpacity>

                    {/* small bottom spacer so last element can scroll above card edge */}
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
  progressBarFill: {
    height: "100%",
    backgroundColor: "#1F2937",
  },

  innerScroll: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },

  titleWrap: { alignItems: "center", paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: "#F3F6F9" },
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
  // ensure last field doesn't get extra right margin
  fieldLast: { marginRight: 0 },
  label: { fontSize: 12, color: "#6B7280", marginBottom: 6 },
  input: {
    backgroundColor: "#F8FAFB",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    color: "#111827",
  },

  select: {
    marginTop: 6,
    backgroundColor: "#F8FAFB",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectText: { color: "#111827" },

  options: {
    marginTop: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    overflow: "hidden",
  },
  optionRow: { paddingVertical: 10, paddingHorizontal: 12 },
  optionText: { color: "#111827" },

  helper: { color: "#9AA3AD", fontSize: 12, marginTop: 4, marginBottom: 8 },

  chipsWrap: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  chip: {
    borderWidth: 1,
    borderColor: "#E6EEF6",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  chipActive: { backgroundColor: "#FFFBF2", borderColor: "#F97316" },
  chipText: { color: "#111827", fontSize: 13 },
  chipTextActive: { color: "#F97316", fontWeight: "600" },

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