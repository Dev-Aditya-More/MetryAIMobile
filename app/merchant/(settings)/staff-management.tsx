import { BusinessService } from "@/api/merchant/business";
import { StaffService } from "@/api/merchant/staff";
import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* ------------------------------ TYPES ------------------------------ */
type Staff = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  active: boolean;
  raw?: any;
};

const PRIMARY = "#6366F1";

/* ------------------------------ SCREEN ------------------------------ */
export default function StaffManagement() {
  const router = useRouter();

  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const activeCount = useMemo(
    () => staff.filter((s) => s.active).length,
    [staff]
  );

  /* ---------------- LOAD STAFF ---------------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const businessId = await BusinessService.getBusinessesId();
        const apiStaffRes = await StaffService.getStaff(businessId);

        const apiStaff = apiStaffRes.success && Array.isArray(apiStaffRes.data) ? apiStaffRes.data : [];

        const mappedStaff: Staff[] = (apiStaff as any[]).map((s: any) => ({
          id: String(s.id),
          name: s.name ?? "Unnamed",
          role: "Staff",
          email: s.email ?? "",
          phone: s.fullPhone ?? "",
          active: true,
          raw: s,
        }));

        setStaff(mappedStaff);
      } catch (error) {
        console.error("Failed to load staff:", error);
        Alert.alert("Error", "Unable to load staff members");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* ---------------- ACTIONS ---------------- */
  const toggleActive = (id: string) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    Alert.alert("Delete Staff", "Are you sure you want to delete?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: confirmDelete,
      },
    ]);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await StaffService.deleteStaff(deleteId);

      if (res.success) {
        setStaff((prev) => prev.filter((s) => s.id !== deleteId));
        Alert.alert("Staff deleted successfully");
      } else {
        Alert.alert("Unable to delete staff");
      }
    } catch {
      Alert.alert("Something went wrong");
    } finally {
      setDeleteId(null);
    }
  };

  const handleEdit = (member: Staff) => {
    router.replace({
      pathname: "/merchant/(settings)/staff-edit",
      params: {
        staffId: member.id,
        staff: JSON.stringify(member.raw ?? member),
      },
    });
  };

  const handleAddStaff = () => {
    router.replace("/merchant/(settings)/staff-add");
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    return parts.length === 1
      ? parts[0][0]?.toUpperCase()
      : `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  };

  /* ---------------- UI ---------------- */
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Staff Management</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Team Header */}
        <View style={styles.teamHeader}>
          <Text style={styles.teamTitle}>Team Members</Text>
          <Text style={styles.teamSubtitle}>
            {activeCount} active staff member{activeCount === 1 ? "" : "s"}
          </Text>

          <TouchableOpacity
            style={styles.addButtonWrapper}
            onPress={handleAddStaff}
          >
            <Ionicons name="add" size={16} color={colors.primary} />
            <Text style={styles.teamAddText}>Add Staff Member</Text>
          </TouchableOpacity>
        </View>

        {/* Loading */}
        {loading && (
          <Text style={styles.loadingText}>Loading staff members...</Text>
        )}

        {/* Empty */}
        {!loading && staff.length === 0 && (
          <Text style={styles.emptyText}>No staff members found</Text>
        )}

        {/* Staff Cards */}
        {!loading &&
          staff.map((member) => (
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
                      <Text style={styles.statusBadgeText}>
                        {member.active ? "Active" : "Inactive"}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.staffRole}>{member.role}</Text>

                  <View style={styles.infoRow}>
                    <Ionicons
                      name="mail-outline"
                      size={14}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.infoText}>{member.email}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons
                      name="call-outline"
                      size={14}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.infoText}>{member.phone}</Text>
                  </View>
                </View>

                <Switch
                  value={member.active}
                  onValueChange={() => toggleActive(member.id)}
                  trackColor={{ false: colors.border, true: PRIMARY }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.staffFooter}>
                <TouchableOpacity onPress={() => handleEdit(member)}>
                  <Ionicons
                    name="pencil-outline"
                    size={18}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(member.id)}>
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

  contentInner: { padding: 16, paddingBottom: 32 },

  teamHeader: { marginBottom: 12 },
  teamTitle: { fontSize: 16, fontWeight: "600", color: colors.textPrimary },
  teamSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },

  addButtonWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  teamAddText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
  },

  loadingText: {
    textAlign: "center",
    marginTop: 24,
    color: colors.textSecondary,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 24,
    color: colors.muted,
  },

  staffCard: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },

  staffTopRow: { flexDirection: "row" },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: { color: colors.onPrimary, fontWeight: "600" },

  staffMainInfo: { flex: 1 },
  nameBadgeRow: { flexDirection: "row", alignItems: "center" },
  staffName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
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
    color: colors.onPrimary,
    fontWeight: "600",
  },

  staffRole: { fontSize: 13, color: colors.textSecondary },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  infoText: { fontSize: 13, color: colors.textSecondary },

  staffFooter: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
