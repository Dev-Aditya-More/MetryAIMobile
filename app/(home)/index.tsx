import React from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
  const { state } = useHome();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.welcome}>Welcome back,</Text>
          <Text style={styles.welcomeName}>{state.welcomeName}</Text>
        </View>

        {state.metrics.map((m, i) => (
          <MetricCard key={i} title={m.title} value={m.value} delta={m.deltaPct} />
        ))}

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Today's Attendance</Text>
            <TouchableOpacity>
              <Text style={styles.link}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.rowBetween, { marginTop: 8 }]}>
            <Text style={{ color: "#16A34A" }}>In-Shop{"\n"}<Text style={styles.bold}>4 Staff</Text></Text>
            <Text style={{ color: "#DC2626", textAlign: "right" }}>Off Duty{"\n"}<Text style={styles.bold}>8 Staff</Text></Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Today's Appointments</Text>
            <TouchableOpacity>
              <Text style={styles.link}>See All</Text>
            </TouchableOpacity>
          </View>

          {["Milbon 4-Step Treatment", "Permanent Wave", "Hair Cut", "Process Color"].map((t, idx) => (
            <View key={idx}>
              <View style={[styles.rowBetween, { paddingVertical: 12 }] }>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={styles.avatarSmall} />
                  <View>
                    <Text style={styles.itemTitle}>{t}</Text>
                    <Text style={styles.itemSub}>David · 1 AM-2 AM</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </View>
              {idx < 3 && <View style={styles.separator} />}
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sales Report (This week)</Text>
          <View style={{ height: 140, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "#6B7280" }}>Chart placeholder</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Top 5 Task Statistic (This week)</Text>
          {["Hair Cut", "Hair Color", "Permanent Wave", "Treatment", "Styling"].map((n, i) => (
            <View key={i} style={{ marginTop: 10 }}>
              <Text style={styles.itemTitle}>{i + 1}. {n}</Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${80 - i * 6}%` }]} />
              </View>
            </View>
          ))}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scroll: { padding: 16, paddingBottom: 100 },
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
  fab: { position: "absolute", right: 18, bottom: 24, backgroundColor: "#BFA78A", width: 44, height: 44, borderRadius: 22, justifyContent: "center", alignItems: "center", elevation: 3 }
});


