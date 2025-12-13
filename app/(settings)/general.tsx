import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function General() {
  const router = useRouter();

  const [fullName, setFullName] = useState("Yauhen Rymaszewski");
  const [nickname, setNickname] = useState("Yauhen Rymaszewski");
  const [jobTitle, setJobTitle] = useState("Product designer");
  const [phone, setPhone] = useState("( 555 ) 123-4567");
  const [email, setEmail] = useState("yauhen1312@gmail.com");

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
        <View style={{ width: 22 }} />{/* spacer for centering */}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {renderField("Full Name", fullName, setFullName)}
        {renderField("Nickname", nickname, setNickname)}
        {renderField("Job Title", jobTitle, setJobTitle)}
        {renderField("Phone Number", phone, setPhone, {
          keyboardType: "phone-pad",
        })}
        {renderField("Email", email, setEmail, {
          keyboardType: "email-address",
        })}

        <TouchableOpacity
          style={styles.deleteButton}
          activeOpacity={0.8}
          onPress={() => {
            // TODO: delete account logic
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

  deleteButton: {
    marginTop: 32,
    borderWidth: 1,
    borderColor: "#EF4444", // destructive stays explicit
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },

  deleteButtonText: {
    color: "#EF4444",
    fontWeight: "600",
    fontSize: 15,
  },
});

