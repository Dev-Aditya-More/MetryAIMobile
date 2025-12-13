// app/(home)/index.tsx

import BottomNav from "@/components/BottomNav";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeProvider, useHome } from "./_context/HomeContext";

/* ---------- Metric Card ---------- */
function MetricCard({
  title,
  value,
  delta,
}: {
  title: string;
  value: string;
  delta?: number;
}) {
  const isPositive = (delta ?? 0) >= 0;

  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricTitle}>{title.toUpperCase()}</Text>
      <View style={styles.rowBetween}>
        <Text style={styles.metricValue}>{value}</Text>
        {typeof delta === "number" && (
          <Text
            style={[
              styles.delta,
              { color: isPositive ? "#16A34A" : "#DC2626" },
            ]}
          >
            {isPositive ? "▲" : "▼"} {Math.abs(delta)}%
          </Text>
        )}
      </View>
    </View>
  );
}

/* ---------- Business Dropdown ---------- */
function BusinessDropdown() {
  const { state, setBusinessId } = useHome();
  const [open, setOpen] = React.useState(false);

  const selectedBusiness = state.businesses.find(
    (b) => b.id === state.selectedBusinessId
  );

  return (
    <View style={{ position: "relative" }}>
      <TouchableOpacity
        onPress={() => setOpen((v) => !v)}
        style={styles.dropdownTrigger}
        activeOpacity={0.8}
      >
        <Text style={styles.dropdownText}>
          {selectedBusiness?.name || "Select Business"}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#6B7280" />
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdownMenu}>
          {state.businesses.map((b) => (
            <TouchableOpacity
              key={b.id}
              style={styles.dropdownItem}
              onPress={async () => {
                setOpen(false);
                await setBusinessId(b.id);
              }}
            >
              <Text style={styles.dropdownItemText}>{b.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

/* ---------- Home Content ---------- */
function HomeContent() {
  const { state, reload } = useHome();

  if (state.loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const metrics =
    state.metrics.length > 0
      ? state.metrics
      : [
          { title: "Today's Revenue", value: "$1,214", deltaPct: -36 },
          { title: "Appointments", value: "0", deltaPct: 0 },
          { title: "Clients", value: "0", deltaPct: 0 },
        ];

  const appointments = state.appointments ?? [];

  const staffOnly = state.staffList.filter((s) => !s.isClient);
  const onlineCount = staffOnly.filter((s) => s.online).length;
  const offlineCount = staffOnly.length - onlineCount;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------- Welcome Header ---------- */}
        <View style={styles.welcomeRow}>
          <View>
            <Text style={styles.welcome}>Welcome back,</Text>
            <Text style={styles.welcomeName}>{state.welcomeName}</Text>
          </View>

          <BusinessDropdown />
        </View>

        {/* ---------- Metrics ---------- */}
        {metrics.map((m, i) => (
          <MetricCard
            key={i}
            title={m.title}
            value={m.value}
            delta={(m as any).deltaPct}
          />
        ))}

        {/* ---------- Attendance ---------- */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Today's Attendance</Text>
            <Text style={styles.link}>View All</Text>
          </View>

          <View style={[styles.rowBetween, { marginTop: 8 }]}>
            <View>
              <Text style={{ color: "#16A34A" }}>In-Shop</Text>
              <Text style={styles.bold}>{onlineCount} Staff</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ color: "#DC2626" }}>Off Duty</Text>
              <Text style={styles.bold}>{offlineCount} Staff</Text>
            </View>
          </View>
        </View>

        {/* ---------- Appointments ---------- */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Today's Appointments</Text>
            <Text style={styles.link}>See All</Text>
          </View>

          {appointments.length === 0 ? (
            <View style={{ paddingVertical: 18 }}>
              <Text style={{ color: "#6B7280" }}>No appointments today</Text>
              <TouchableOpacity onPress={reload} style={{ marginTop: 8 }}>
                <Text style={{ color: "#2563EB" }}>Refresh</Text>
              </TouchableOpacity>
            </View>
          ) : (
            appointments.map((appt) => (
              <View key={appt.id}>
                <View style={[styles.rowBetween, { paddingVertical: 12 }]}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={styles.avatarSmall} />
                    <View>
                      <Text style={styles.itemTitle}>
                        {appt.service_name || "—"}
                      </Text>
                      <Text style={styles.itemSub}>
                        {appt.staff_name ?? "—"} ·{" "}
                        {formatTimeRange(appt.start_time, appt.end_time)}
                      </Text>
                    </View>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color="#9CA3AF"
                  />
                </View>
                <View style={styles.separator} />
              </View>
            ))
          )}
        </View>

        {/* ---------- Sales Graph ---------- */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Sales Report</Text>
            <Text style={styles.link}>This Week</Text>
          </View>

          <View style={styles.chartContainer}>
            <Ionicons name="stats-chart" size={28} color="#9CA3AF" />
            <Text style={styles.chartText}>
              Sales graph will appear here
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ---------- Floating Action Button ---------- */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <BottomNav />
    </SafeAreaView>
  );
}

/* ---------- Export ---------- */
export default function HomeScreen() {
  return (
    <HomeProvider>
      <HomeContent />
    </HomeProvider>
  );
}

/* ---------- Helpers ---------- */
function formatTimeRange(start?: string, end?: string) {
  if (!start || !end) return "";
  try {
    const s = new Date(start);
    const e = new Date(end);
    return `${s.toLocaleTimeString([], {
      hour: "numeric",
      hour12: true,
    })} - ${e.toLocaleTimeString([], { hour: "numeric", hour12: true })}`;
  } catch {
    return "";
  }
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  center: { justifyContent: "center", alignItems: "center" },
  scroll: {
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 120 : 100,
  },

  welcomeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  welcome: { color: "#6B7280", fontSize: 13 },
  welcomeName: { color: "#111827", fontSize: 20, fontWeight: "700" },

  dropdownTrigger: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  dropdownText: {
    fontSize: 13,
    fontWeight: "500",
    marginRight: 4,
    color: "#111827",
  },
  dropdownMenu: {
    position: "absolute",
    top: 38,
    right: 0,
    width: 180,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    elevation: 4,
    zIndex: 999,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownItemText: {
    fontSize: 13,
    color: "#111827",
  },

  metricCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  metricTitle: { fontSize: 12, color: "#6B7280" },
  metricValue: { fontSize: 18, fontWeight: "700" },
  delta: { fontSize: 12, fontWeight: "600" },

  card: {
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: { fontSize: 14, fontWeight: "700" },
  link: { fontSize: 12, color: "#6B7280" },

  avatarSmall: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#E5E7EB",
    marginRight: 10,
  },

  itemTitle: { fontSize: 14, fontWeight: "600" },
  itemSub: { fontSize: 12, color: "#6B7280" },
  bold: { fontWeight: "700" },

  separator: { height: 1, backgroundColor: "#E5E7EB" },

  chartContainer: {
    height: 180,
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  chartText: {
    marginTop: 6,
    fontSize: 12,
    color: "#6B7280",
  },

  fab: {
    position: "absolute",
    right: 18,
    bottom: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#BFA78A",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
});
