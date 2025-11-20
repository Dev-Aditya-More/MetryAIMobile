// app/(home)/index.tsx
import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { HomeProvider, useHome } from "./_context/HomeContext";
import BottomNav from "@/components/BottomNav";

function MetricCard({ title, value, delta }: { title: string; value: string; delta?: number }) {
  const isPositive = (delta ?? 0) >= 0;
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricTitle}>{title.toUpperCase()}</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={styles.metricValue}>{value}</Text>
        {typeof delta === "number" && (
          <Text style={[styles.delta, { color: isPositive ? "#16A34A" : "#DC2626" }]}>
            {isPositive ? "▲" : "▼"} {Math.abs(delta)}%
          </Text>
        )}
      </View>
    </View>
  );
}

function HomeContent() {
  const { state, reload } = useHome();

  if (state.loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  // metrics fallback (kept until backend analytics exist)
  const metrics = state.metrics.length > 0 ? state.metrics : [
    { title: "Today's Revenue", value: "$1,214", deltaPct: -36 },
    { title: "Appointments", value: "0", deltaPct: 0 },
    { title: "Clients", value: "0", deltaPct: 0 },
  ];

  const appointments = state.appointments ?? [];

  // attendance computed from staffList (exclude clients)
  const staffOnly = state.staffList.filter((s) => !s.isClient);
  const onlineCount = staffOnly.filter((s) => s.online).length;
  const offlineCount = staffOnly.length - onlineCount;

  const welcomeName = state.welcomeName || "Business Owner";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.welcome}>Welcome back,</Text>
          <Text style={styles.welcomeName}>{welcomeName}</Text>
        </View>

        {metrics.map((m, i) => (
          <MetricCard key={i} title={m.title} value={m.value} delta={(m as any).deltaPct} />
        ))}

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Today's Attendance</Text>
            <TouchableOpacity onPress={() => { /* future: navigate to attendance page */ }}>
              <Text style={styles.link}>View All</Text>
            </TouchableOpacity>
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

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Today's Appointments</Text>
            <TouchableOpacity onPress={() => { /* future: navigate to appointments list */ }}>
              <Text style={styles.link}>See All</Text>
            </TouchableOpacity>
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
                      <Text style={styles.itemTitle}>{appt.service_name || "—"}</Text>
                      <Text style={styles.itemSub}>
                        {appt.staff_name ?? "—"} · {formatTimeRange(appt.start_time, appt.end_time)}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </View>
                <View style={styles.separator} />
              </View>
            ))
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sales Report (This week)</Text>
          <View style={{ height: 140, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "#6B7280" }}>Chart placeholder</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Top 5 Task Statistic (This week)</Text>
          {/* fallback mock tasks until backend analytics exist */}
          {[
            { name: "Hair Cut", bookings: 156 },
            { name: "Hair Color", bookings: 124 },
            { name: "Permanent Wave", bookings: 98 },
            { name: "Treatment", bookings: 87 },
            { name: "Styling", bookings: 64 },
          ].map((task, i) => {
            const pct = Math.min(100, Math.max(6, (task.bookings / 156) * 100));
            return (
              <View key={task.name} style={{ marginTop: 10 }}>
                <Text style={styles.itemTitle}>{i + 1}. {task.name} <Text style={{ fontSize: 12, color: "#6B7280" }}>{task.bookings} bookings</Text></Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${pct}%` }]} />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <BottomNav />
    </SafeAreaView>
  );
}

export default function HomeScreen() {
  return (
    <HomeProvider>
      <HomeContent />
    </HomeProvider>
  );
}

/* ---------- helpers & styles ---------- */

function formatTimeRange(start?: string, end?: string) {
  if (!start && !end) return "";
  try {
    const s = start ? new Date(start) : null;
    const e = end ? new Date(end) : null;
    if (!s || !e || isNaN(s.getTime()) || isNaN(e.getTime())) return "";
    // simple short format e.g. "1:00 AM - 2:00 AM"
    const opts: Intl.DateTimeFormatOptions = { hour: "numeric", minute: undefined, hour12: true };
    return `${s.toLocaleTimeString([], opts)} - ${e.toLocaleTimeString([], opts)}`;
  } catch {
    return "";
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scroll: { padding: 16, paddingBottom: Platform.OS === "ios" ? 120 : 100 },
  welcome: { color: "#6B7280", fontSize: 13 },
  welcomeName: { color: "#111827", fontSize: 20, fontWeight: "700" },
  metricCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  metricTitle: { color: "#6B7280", fontSize: 12 },
  metricValue: { color: "#111827", fontSize: 18, fontWeight: "700", marginTop: 4 },
  delta: { fontSize: 12, fontWeight: "600" },

  card: {
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#111827" },
  link: { color: "#6B7280", fontSize: 12 },
  avatarSmall: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#E5E7EB", marginRight: 10 },
  itemTitle: { color: "#111827", fontSize: 14, fontWeight: "600" },
  itemSub: { color: "#6B7280", fontSize: 12 },
  bold: { fontWeight: "700" },
  separator: { height: 1, backgroundColor: "#E5E7EB" },
  progressBarBg: { height: 6, backgroundColor: "#E5E7EB", borderRadius: 6, overflow: "hidden", marginTop: 4 },
  progressBarFill: { height: 6, backgroundColor: "#60A5FA" },
  fab: { position: "absolute", right: 18, bottom: 24, backgroundColor: "#BFA78A", width: 44, height: 44, borderRadius: 22, justifyContent: "center", alignItems: "center", elevation: 3 },
});
