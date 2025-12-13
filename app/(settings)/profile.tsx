import { AuthService } from "@/api/auth";
import { colors } from "@/theme/colors";
import { pickImage, uploadImage } from "@/utils/pickImage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const router = useRouter();

  /* ---------------- STATE ---------------- */
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState(false);

  const [initialProfile, setInitialProfile] = useState<{
    fullName: string;
    countryCode: string;
    phone: string;
    email: string;
    avatarUrl: string | null;
  } | null>(null);

  /* ---------------- LOAD PROFILE ---------------- */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        const res = await AuthService.getProfile();
        if (!res) return;

        const loadedProfile = {
          fullName: res.fullName ?? "",
          email: res.email ?? "",
          countryCode: res.phoneCode ?? "+91",
          phone: res.phone ?? res.fullPhone ?? "",
          avatarUrl: res.avatarUrl ?? null,
        };

        setFullName(loadedProfile.fullName);
        setEmail(loadedProfile.email);
        setCountryCode(loadedProfile.countryCode);
        setPhone(loadedProfile.phone);
        setAvatarUrl(loadedProfile.avatarUrl);
        setAvatarError(false);

        setInitialProfile(loadedProfile);
      } catch (error) {
        console.error("Failed to load profile:", error);
        Alert.alert("Error", "Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  /* ---------------- DIRTY CHECK ---------------- */
  const isDirty = useMemo(() => {
    if (!initialProfile) return false;
    return (
      initialProfile.fullName !== fullName ||
      initialProfile.countryCode !== countryCode ||
      initialProfile.phone !== phone ||
      initialProfile.email !== email ||
      initialProfile.avatarUrl !== avatarUrl
    );
  }, [initialProfile, fullName, countryCode, phone, email, avatarUrl]);

  /* ---------------- HANDLERS ---------------- */
  const handleUpdateProfile = async () => {
    if (!isDirty) return;

    try {
      const payload = {
        fullName,
        avatarUrl: avatarUrl ?? "",
        phoneCode: countryCode,
        phone,
        email,
      };

      await AuthService.setupProfile(payload);

      Alert.alert("Success", "Profile updated successfully");

      setInitialProfile({
        fullName,
        countryCode,
        phone,
        email,
        avatarUrl,
      });
    } catch (error) {
      Alert.alert("Error", "Could not update profile");
    }
  };

  const handleChangeProfileImage = async () => {
    try {
      const img = await pickImage();
      if (!img) return;

      const uploaded = await uploadImage(img);
      if (uploaded?.data?.url) {
        setAvatarUrl(uploaded.data.url);
      }
    } catch {
      Alert.alert("Error", "Unable to upload image");
    }
  };

  const renderField = (
    label: string,
    value: string,
    onChange: (text: string) => void,
    keyboardType?: "default" | "email-address" | "phone-pad"
  ) => (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        style={styles.input}
        keyboardType={keyboardType ?? "default"}
        editable={!loading}
        placeholderTextColor={colors.muted}
      />
    </View>
  );

  /* ---------------- UI ---------------- */
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.contentInner}>
        {/* Loading */}
        {loading && (
          <Text style={styles.loadingText}>Loading profile...</Text>
        )}

        {!loading && (
          <>
            {/* Avatar */}
            <View style={styles.avatarSection}>
              {avatarUrl && !avatarError ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={styles.avatar}
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={40} color={colors.muted} />
                </View>
              )}

              <TouchableOpacity onPress={handleChangeProfileImage}>
                <Text style={styles.changeAvatarText}>
                  Change profile image
                </Text>
              </TouchableOpacity>
            </View>

            {renderField("Full Name", fullName, setFullName)}

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <View style={styles.phoneRow}>
                <TextInput
                  value={countryCode}
                  onChangeText={setCountryCode}
                  style={[styles.input, styles.countryCodeInput]}
                  keyboardType="phone-pad"
                  editable={!loading}
                />
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  style={[styles.input, styles.phoneInput]}
                  keyboardType="phone-pad"
                  editable={!loading}
                />
              </View>
            </View>

            {renderField("Email", email, setEmail, "email-address")}

            {/* Update */}
            <TouchableOpacity
              style={[
                styles.updateButton,
                (!isDirty || loading) && styles.updateButtonDisabled,
              ]}
              disabled={!isDirty || loading}
              onPress={handleUpdateProfile}
            >
              <Text
                style={[
                  styles.updateButtonText,
                  (!isDirty || loading) && styles.updateButtonTextDisabled,
                ]}
              >
                Update Profile
              </Text>
            </TouchableOpacity>

            {/* Delete */}
            <TouchableOpacity style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete Account</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  contentInner: { padding: 16 },

  loadingText: {
    textAlign: "center",
    marginTop: 40,
    color: colors.textSecondary,
  },

  avatarSection: { alignItems: "center", marginBottom: 24 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  changeAvatarText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "500",
  },

  fieldBlock: { marginBottom: 14 },
  fieldLabel: { fontSize: 12, color: colors.muted, marginBottom: 4 },
  input: {
    backgroundColor: colors.background,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    fontSize: 14,
    color: colors.textPrimary,
  },

  phoneRow: { flexDirection: "row", gap: 8 },
  countryCodeInput: { flexBasis: 90 },
  phoneInput: { flex: 1 },

  updateButton: {
    marginTop: 24,
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  updateButtonDisabled: { backgroundColor: colors.muted },
  updateButtonText: {
    color: colors.onPrimary,
    fontWeight: "600",
    fontSize: 15,
  },
  updateButtonTextDisabled: { color: colors.surface },

  deleteButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#EF4444",
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#EF4444",
    fontWeight: "600",
    fontSize: 15,
  },
});
