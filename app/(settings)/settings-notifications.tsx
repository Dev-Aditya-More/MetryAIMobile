import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsNotifications() {
  const router = useRouter();

  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  const [apptReminder, setApptReminder] = useState(false);
  const [apptSms, setApptSms] = useState(true);
  const [cancellations, setCancellations] = useState(false);

  const [paymentReceipts, setPaymentReceipts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [lowInventory, setLowInventory] = useState(true);
  const [staffUpdates, setStaffUpdates] = useState(false);

  const renderToggleRow = (
    title: string,
    description: string,
    value: boolean,
    onChange: (v: boolean) => void,
    icon?: React.ReactNode
  ) => (
    <View style={styles.toggleRow}>
      <View style={styles.toggleLeft}>
        {icon && <View style={styles.toggleIconWrapper}>{icon}</View>}
        <View style={{ flex: 1 }}>
          <Text style={styles.toggleTitle}>{title}</Text>
          <Text style={styles.toggleDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "#E5E7EB", true: "#6366F1" }}
        thumbColor={value ? "#FFFFFF" : "#FFFFFF"}
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
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Notification Preferences */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>
          <View style={styles.card}>
            {renderToggleRow(
              "Email Notifications",
              "Receive updates via email",
              emailNotif,
              setEmailNotif,
              <Ionicons name="mail-outline" size={18} color="#6366F1" />
            )}
            {renderToggleRow(
              "SMS Notifications",
              "Receive text message alerts",
              smsNotif,
              setSmsNotif,
              <Ionicons name="call-outline" size={18} color="#10B981" />
            )}
          </View>
        </View>

        {/* Appointment Notifications */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Appointment Notifications</Text>
          <View style={styles.card}>
            {renderToggleRow(
              "Appointment Reminders",
              "24 hours before appointments",
              apptReminder,
              setApptReminder
            )}
            {renderToggleRow(
              "SMS Notifications",
              "Receive text message alerts",
              apptSms,
              setApptSms
            )}
            {renderToggleRow(
              "Cancellations",
              "When appointments are cancelled",
              cancellations,
              setCancellations
            )}
          </View>
        </View>

        {/* Business Notifications */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Business Notifications</Text>
          <View style={styles.card}>
            {renderToggleRow(
              "Payment Receipts",
              "When payments are processed",
              paymentReceipts,
              setPaymentReceipts
            )}
            {renderToggleRow(
              "Weekly Reports",
              "Summary of weekly performance",
              weeklyReports,
              setWeeklyReports
            )}
            {renderToggleRow(
              "Low Inventory Alerts",
              "When products are running low",
              lowInventory,
              setLowInventory
            )}
            {renderToggleRow(
              "Staff Updates",
              "Team member schedule changes",
              staffUpdates,
              setStaffUpdates
            )}
          </View>
        </View>
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
    paddingBottom: 32,
  },

  sectionBlock: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },

  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  toggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  toggleIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  toggleDescription: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
});
