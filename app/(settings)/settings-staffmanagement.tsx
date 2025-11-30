import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Staff = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  active: boolean;
};

const INITIAL_STAFF: Staff[] = [
  {
    id: "1",
    name: "Emma Wilson",
    role: "Senior Stylist",
    email: "emma@salon.com",
    phone: "(555) 111-2222",
    active: true,
  },
  {
    id: "2",
    name: "Emma Wilson",
    role: "Senior Stylist",
    email: "emma@salon.com",
    phone: "(555) 111-2222",
    active: true,
  },
  {
    id: "3",
    name: "Emma Wilson",
    role: "Senior Stylist",
    email: "emma@salon.com",
    phone: "(555) 111-2222",
    active: true,
  },
];

const PRIMARY = "#6366F1";

export default function SettingsStaffmanagement() {
  const router = useRouter();
  const [staff, setStaff] = useState<Staff[]>(INITIAL_STAFF);

  const activeCount = useMemo(
    () => staff.filter((s) => s.active).length,
    [staff]
  );

  const toggleActive = (id: string) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const handleDelete = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
  };

  const handleEdit = (id: string) => {
    // later: navigate to edit screen
    router.push("/(settings)/settings-staffedit");
  };

  const handleAddStaff = () => {
    // later: navigate to add-staff form
    router.push("/(settings)/settings-staff-add");
    console.log("Add Staff Member");
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return (parts[0][0] || "").toUpperCase();
    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header (same grey as background to remove strip) */}
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
        {/* Team Members text + add link (on next line & centered) */}
        <View style={styles.teamHeader}>
          <Text style={styles.teamTitle}>Team Members</Text>
          <Text style={styles.teamSubtitle}>
            {activeCount} active staff member{activeCount === 1 ? "" : "s"}
          </Text>

          <TouchableOpacity
            onPress={handleAddStaff}
            activeOpacity={0.8}
            style={styles.addButtonWrapper}
          >
            <Ionicons name="add" size={16} color={PRIMARY} />
            <Text style={styles.teamAddText}>Add Staff Member</Text>
          </TouchableOpacity>
        </View>

        {/* Staff cards */}
        {staff.map((member) => (
          <View key={member.id} style={styles.staffCard}>
            <View style={styles.staffTopRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {getInitials(member.name)}
                </Text>
              </View>

              <View style={styles.staffMainInfo}>
                <View style={styles.nameBadgeRow}>
                  <Text style={styles.staffName}>{member.name}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>Active</Text>
                  </View>
                </View>

                <Text style={styles.staffRole}>{member.role}</Text>

                <View style={styles.infoRow}>
                  <Ionicons
                    name="mail-outline"
                    size={14}
                    color="#6B7280"
                    style={styles.infoIcon}
                  />
                  <Text style={styles.infoText}>{member.email}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons
                    name="call-outline"
                    size={14}
                    color="#6B7280"
                    style={styles.infoIcon}
                  />
                  <Text style={styles.infoText}>{member.phone}</Text>
                </View>
              </View>

              <Switch
                value={member.active}
                onValueChange={() => toggleActive(member.id)}
                trackColor={{ false: "#E5E7EB", true: PRIMARY }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.staffFooter}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.footerButton}
                onPress={() => handleEdit(member.id)}
              >
                <Ionicons name="pencil-outline" size={18} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.footerButton}
                onPress={() => handleDelete(member.id)}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ------------------------------ STYLES ------------------------------ */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },

  addButtonWrapper: {
    flexDirection: "row",
    justifyContent: "center", // center horizontally
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  teamAddText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
    color: PRIMARY,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: "#F3F4F6", // 👈 same as container (no white strip)
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
    paddingVertical: 8,
    paddingBottom: 32,
  },

  /* Team header (no box) */
  teamHeader: {
    marginBottom: 12,
  },

  teamTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  teamSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
    marginBottom: 8, // add spacing before button
  },

  /* Staff card */
  staffCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    marginBottom: 12,
  },
  staffTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  staffMainInfo: {
    flex: 1,
  },
  nameBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  staffName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginRight: 8,
  },
  statusBadge: {
    backgroundColor: "#22C55E",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusBadgeText: {
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  staffRole: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  infoIcon: {
    marginRight: 6,
  },
  infoText: {
    fontSize: 13,
    color: "#6B7280",
  },

  staffFooter: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerButton: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
});
