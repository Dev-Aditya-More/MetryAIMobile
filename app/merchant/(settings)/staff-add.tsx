import { BusinessService } from "@/api/merchant/business";
import { StaffService } from "@/api/merchant/staff";
import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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

export default function StaffAdd() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [phone, setPhone] = useState("");

  const savePressed = async () => {
    try {
      const businessId = await BusinessService.getBusinessesId();

      if (!fullName || !email || !phoneCode || !phone) {
        Alert.alert("All fields are required");
        return;
      }

      const payload = {
        businessId,
        name: fullName,
        email,
        phoneCode,
        phone,
      };

      console.log("Payload for add staff:", payload);

      const res = await StaffService.addStaff(payload);

      if (res) {
        Alert.alert("Added Successfully");
      } else {
        Alert.alert("Something went wrong");
      }

      router.replace("/merchant/(settings)/staff-management");
    } catch (error) {
      console.log(error);
      Alert.alert("Error while adding staff");
    }
  };

  const cancelPressed = () => {
    router.replace("/merchant/(settings)/staff-management");
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

  const initials = fullName ? fullName[0].toUpperCase() : "S";

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Staff</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>

        {/* FIELDS */}
        {renderField("Full Name", fullName, setFullName)}
        {renderField("Email", email, setEmail, {
          keyboardType: "email-address",
        })}
        {renderField("Phone Code", phoneCode, setPhoneCode, {
          keyboardType: "phone-pad",
        })}
        {renderField("Phone Number", phone, setPhone, {
          keyboardType: "phone-pad",
        })}

        {/* SAVE BUTTON */}
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.85}
          onPress={savePressed}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

        {/* CANCEL BUTTON */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: "#9CA3AF", marginTop: 12 },
          ]}
          activeOpacity={0.85}
          onPress={cancelPressed}
        >
          <Text style={styles.saveButtonText}>Cancel</Text>
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
    backgroundColor: colors.background,
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
    paddingBottom: 32,
  },

  avatarWrapper: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },

  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: colors.onPrimary,
    fontWeight: "700",
    fontSize: 18,
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

  saveButton: {
    marginTop: 32,
    borderRadius: 6,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },

  saveButtonText: {
    color: colors.onPrimary,
    fontWeight: "600",
    fontSize: 15,
  },
});

