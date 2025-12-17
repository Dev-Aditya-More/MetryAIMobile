// app/(home)/index.tsx

import BottomNav from "@/components/BottomNav";
import { colors } from "@/theme/colors";
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
        <Ionicons
          name="chevron-down"
          size={16}
          color={colors.textSecondary}
        />
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
        <ActivityIndicator size="large" color={colors.primary} />
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
        {/* Welcome */}
        <View style={styles.welcomeRow}>
          <View>
            <Text style={styles.welcome}>Welcome back,</Text>
            <Text style={styles.welcomeName}>{state.welcomeName}</Text>
          </View>
          <BusinessDropdown />
        </View>

        {/* Metrics */}
        {metrics.map((m, i) => (
          <MetricCard
            key={i}
            title={m.title}
            value={m.value}
            delta={(m as any).deltaPct}
          />
        ))}

        {/* Attendance */}
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

        {/* Appointments */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Today's Appointments</Text>
            <Text style={styles.link}>See All</Text>
          </View>

          {appointments.length === 0 ? (
            <View style={{ paddingVertical: 18 }}>
              <Text style={{ color: colors.textSecondary }}>
                No appointments today
              </Text>
              <TouchableOpacity onPress={reload} style={{ marginTop: 8 }}>
                <Text style={{ color: colors.accentBlue }}>Refresh</Text>
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
                        {appt.staff_name ?? "—"}
                      </Text>
                    </View>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.muted}
                  />
                </View>
                <View style={styles.separator} />
              </View>
            ))
          )}
        </View>

        {/* Sales */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Sales Report</Text>
            <Text style={styles.link}>This Week</Text>
          </View>

          <View style={styles.chartContainer}>
            <Ionicons name="stats-chart" size={28} color={colors.muted} />
            <Text style={styles.chartText}>
              Sales graph will appear here
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <Ionicons name="add" size={24} color={colors.onPrimary} />
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

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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
  welcome: { color: colors.textSecondary, fontSize: 13 },
  welcomeName: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "700",
  },

  dropdownTrigger: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  dropdownText: {
    fontSize: 13,
    fontWeight: "500",
    marginRight: 4,
    color: colors.textPrimary,
  },
  dropdownMenu: {
    position: "absolute",
    top: 38,
    right: 0,
    width: 180,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.textPrimary,
  },

  metricCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: colors.background,
  },
  metricTitle: { fontSize: 12, color: colors.textSecondary },
  metricValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  delta: { fontSize: 12, fontWeight: "600" },

  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  link: { fontSize: 12, color: colors.textSecondary },

  avatarSmall: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.border,
    marginRight: 10,
  },

  itemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  itemSub: { fontSize: 12, color: colors.textSecondary },
  bold: { fontWeight: "700", color: colors.textPrimary },

  separator: { height: 1, backgroundColor: colors.border },

  chartContainer: {
    height: 180,
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  chartText: {
    marginTop: 6,
    fontSize: 12,
    color: colors.textSecondary,
  },

  fab: {
    position: "absolute",
    right: 18,
    bottom: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
});
