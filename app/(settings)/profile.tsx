import { AuthService } from "@/api/auth";
import { PickedImage, pickImage, uploadImage } from "@/utils/pickImage";
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

  // ---------- FORM STATE ----------
  const [fullName, setFullName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const [image, setImage] = useState<PickedImage | null>(null);

  // Keep original profile to detect changes (for Update Profile button)
  const [initialProfile, setInitialProfile] = useState<{
    fullName: string;
    countryCode: string;
    phone: string;
    email: string;
    avatarUrl: string | null;
  } | null>(null);

  // ---------- LOAD PROFILE FROM API ----------
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await AuthService.getProfile();
        console.log("Profile response:", res);

        if (!res) return;

        const loadedFullName = res.fullName ?? "";
        const loadedEmail = res.email ?? "";
        const loadedCountryCode = res.phoneCode ?? "+91";
        const loadedPhone = res.phone ?? res.fullPhone ?? "";

        const loadedAvatarUrl = res.avatarUrl || null;

        setFullName(loadedFullName);
        setEmail(loadedEmail);
        setCountryCode(loadedCountryCode);
        setPhone(loadedPhone);
        setAvatarUrl(loadedAvatarUrl);
        setAvatarError(false);

        setInitialProfile({
          fullName: loadedFullName,
          countryCode: loadedCountryCode,
          phone: loadedPhone,
          email: loadedEmail,
          avatarUrl: loadedAvatarUrl,
        });
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };

    loadProfile();
  }, []);

  // ---------- DIRTY CHECK (any change?) ----------
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

  // ---------- HANDLERS ----------
  const handleUpdateProfile = async () => {
    if (!isDirty) return; // prevent accidental call

    try {
      const payload = {
        fullName,
        avatarUrl: avatarUrl ?? "",
        phoneCode: countryCode,
        phone,
        email,
      };

      console.log("Updating profile with payload:", payload);

      const res = await AuthService.setupProfile(payload);

      Alert.alert("Success", "Profile updated successfully");

      // Update baseline state so button disables
      setInitialProfile({
        fullName,
        countryCode,
        phone,
        email,
        avatarUrl,
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      Alert.alert("Error", "Could not update profile. Try again.");
    }
  };

  const handleChangeProfileImage = async () => {
    try {
      const img = await pickImage();
      if (img) {
        setImage(img);
        const uploadedData = await uploadImage(img);
        if (uploadedData) {
          setAvatarUrl(uploadedData.data.url);
        }
      }
    } catch (err) {
      console.log("Upload Image Erro!,", err);
      Alert.alert("Something went wrong,Not Able to Upload Image");
    }

    // TODO: integrate pickImage + uploadImage here
    console.log("Change profile image pressed");
  };

  const renderField = (
    label: string,
    value: string,
    onChange: (text: string) => void,
    options?: { keyboardType?: "default" | "email-address" | "phone-pad" }
  ) => (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        style={styles.input}
        keyboardType={options?.keyboardType ?? "default"}
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 22 }} />
        {/* spacer for centering */}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          {avatarUrl && !avatarError ? (
            <Image
              source={{ uri: avatarUrl }}
              style={styles.avatar}
              onError={() => setAvatarError(true)}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color="#9CA3AF" />
            </View>
          )}

          <TouchableOpacity
            onPress={handleChangeProfileImage}
            activeOpacity={0.7}
          >
            <Text style={styles.changeAvatarText}>Change profile image</Text>
          </TouchableOpacity>
        </View>

        {/* Full Name */}
        {renderField("Full Name", fullName, setFullName)}

        {/* Phone: Country code + number */}
        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>Phone Number</Text>
          <View style={styles.phoneRow}>
            <TextInput
              value={countryCode}
              onChangeText={setCountryCode}
              style={[styles.input, styles.countryCodeInput]}
              keyboardType="phone-pad"
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              style={[styles.input, styles.phoneInput]}
              keyboardType="phone-pad"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Email */}
        {renderField("Email", email, setEmail, {
          keyboardType: "email-address",
        })}

        {/* Update Profile Button */}
        <TouchableOpacity
          style={[styles.updateButton, !isDirty && styles.updateButtonDisabled]}
          activeOpacity={isDirty ? 0.8 : 1}
          onPress={handleUpdateProfile}
          disabled={!isDirty}
        >
          <Text
            style={[
              styles.updateButtonText,
              !isDirty && styles.updateButtonTextDisabled,
            ]}
          >
            Update Profile
          </Text>
        </TouchableOpacity>

        {/* Delete account (unchanged) */}
        <TouchableOpacity
          style={styles.deleteButton}
          activeOpacity={0.8}
          onPress={() => {
            console.log("Delete account");
          }}
        >
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const PRIMARY = "#6366F1";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: "#F3F4F6",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  content: { flex: 1 },
  contentInner: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  /* Avatar */
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E5E7EB",
    marginBottom: 8,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  changeAvatarText: {
    fontSize: 13,
    color: PRIMARY,
    fontWeight: "500",
  },

  /* Fields */
  fieldBlock: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
  },

  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  countryCodeInput: {
    flexBasis: 90,
    flexShrink: 0,
  },
  phoneInput: {
    flex: 1,
  },

  /* Update button */
  updateButton: {
    marginTop: 24,
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PRIMARY,
  },
  updateButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  updateButtonTextDisabled: {
    color: "#E5E7EB",
  },

  /* Delete button */
  deleteButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#EF4444",
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#EF4444",
    fontWeight: "600",
    fontSize: 15,
  },
});
