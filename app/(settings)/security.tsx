import { AuthService } from "@/api/auth";
import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#6366F1";
const PRIMARY_DISABLED = "#A5B4FC";

export default function Security() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordsMatch = useMemo(
    () =>
      newPassword.length > 0 &&
      confirmPassword.length > 0 &&
      newPassword === confirmPassword,
    [newPassword, confirmPassword]
  );

  const canSubmit =
    currentPassword.length > 0 &&
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    passwordsMatch;

  const updatePass = async () => {
    if (!canSubmit) return;

    // TODO: call API to update password here
    try{
      await AuthService.updatePassword(currentPassword, newPassword);
    }
    catch(err){
      Alert.alert("Error", "Failed to update password. Please try again.");
    }
    // after successful update:
    router.replace("/(onboarding)/login");
  };

  const renderField = (
    label: string,
    value: string,
    onChange: (text: string) => void
  ) => (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        style={styles.input}
        secureTextEntry
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
        <Text style={styles.headerTitle}>Security</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {renderField("Current Password", currentPassword, setCurrentPassword)}
        {renderField("New Password", newPassword, setNewPassword)}
        {renderField(
          "Confirm New Password",
          confirmPassword,
          setConfirmPassword
        )}

        {/* Error message when passwords don't match */}
        {newPassword.length > 0 &&
          confirmPassword.length > 0 &&
          !passwordsMatch && (
            <Text style={styles.errorText}>Passwords do not match</Text>
          )}

        <TouchableOpacity
          style={[
            styles.updateButton,
            { backgroundColor: canSubmit ? PRIMARY : PRIMARY_DISABLED },
          ]}
          activeOpacity={canSubmit ? 0.8 : 1}
          onPress={updatePass}
          disabled={!canSubmit}
        >
          <Text style={styles.updateButtonText}>Update Password</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: colors.surface,
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

  content: {
    flex: 1,
  },

  contentInner: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  fieldBlock: {
    marginBottom: 14,
  },

  fieldLabel: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 4,
  },

  input: {
    backgroundColor: colors.background,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textPrimary,
  },

  errorText: {
    marginTop: 2,
    marginBottom: 8,
    fontSize: 12,
    color: "#DC2626", // destructive error color stays explicit
  },

  updateButton: {
    marginTop: 32,
    borderRadius: 6,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },

  updateButtonText: {
    color: colors.onPrimary,
    fontWeight: "600",
    fontSize: 15,
  },
});

