import { StaffService } from "@/api/staff";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
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

export default function StaffEdit() {
  const { staff } = useLocalSearchParams();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [businessID, setBusinessId] = useState("");
  const [staffId, setStaffId] = useState("");
  // store initial values for DIRTY CHECK
  const [initialValues, setInitialValues] = useState({
    fullName: "",
    phone: "",
    email: "",
  });

  // parse staff from params and pre-fill fields
  useEffect(() => {
    try {
      if (staff) {
        const parsed = JSON.parse(staff as string);

        const nameFromApi = parsed.name ?? parsed.fullName ?? "";
        const phoneFromApi = parsed.fullPhone ?? parsed.phone ?? "";
        const emailFromApi = parsed.email ?? "";
        const businessidApi = parsed.businessId ?? "";
        const staffidApi = parsed.id ?? "";

        setFullName(nameFromApi);
        setPhone(phoneFromApi);
        setEmail(emailFromApi);
        setBusinessId(businessidApi);
        setStaffId(staffidApi);

        setInitialValues({
          fullName: nameFromApi,
          phone: phoneFromApi,
          email: emailFromApi,
        });
      }
    } catch (e) {
      console.log("Failed to parse staff param", e);
    }
  }, [staff]);

  // DIRTY CHECK: enable Save only if something changed
  const isDirty = useMemo(() => {
    return (
      fullName !== initialValues.fullName ||
      phone !== initialValues.phone ||
      email !== initialValues.email
    );
  }, [fullName, phone, email, initialValues]);

  const savePressed = async () => {
    if (!isDirty) return;

    // collect everything here and send to your API
    const payload = {
      id: staffId,
      businessId: businessID,
      name: fullName,
      email,
      fullPhone: phone,
    };

    console.log("Payload", payload);
    const res = await StaffService.updateStaff(payload);

    if (res) {
      Alert.alert("Updated Successfully");
    } else {
      Alert.alert("Not able Update");
    }

    // after successful save:
    router.replace("/(settings)/staff-management");
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

  const getInitials = (name: string) => {
    const cleaned = name.trim();
    if (!cleaned) return "";
    const parts = cleaned.split(" ");
    if (parts.length === 1) return (parts[0][0] || "").toUpperCase();
    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
  };

  const initials = getInitials(fullName || "Staff");

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Staff Management</Text>
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

        {renderField("Full Name", fullName, setFullName)}
        {renderField("Phone Number", phone, setPhone, {
          keyboardType: "phone-pad",
        })}
        {renderField("Email", email, setEmail, {
          keyboardType: "email-address",
        })}

        <TouchableOpacity
          style={[
            styles.saveButton,
            !isDirty && styles.saveButtonDisabled, // greyed out when not dirty
          ]}
          activeOpacity={isDirty ? 0.85 : 1}
          onPress={savePressed}
          disabled={!isDirty}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
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
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
  },

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

  saveButton: {
    marginTop: 32,
    borderRadius: 6,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PRIMARY,
  },
  saveButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
});
