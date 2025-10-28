import React, { useMemo } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { ContactProvider, useContact } from "./_context/ContactContext";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "@/components/BottomNav";

function Badge({ label }: { label: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

function PersonRow({ name, online, tags }: { name: string; online: boolean; tags?: string[] }) {
  return (
    <View style={styles.row}>
      <View style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.personName}>{name}</Text>
        <Text style={[styles.personStatus, { color: online ? "#10B981" : "#6B7280" }]}>
          {online ? "Online" : "Offline"}
        </Text>
      </View>
      <View style={{ flexDirection: "row", gap: 6 }}>
        {tags?.map((t, i) => (
          <Badge key={i} label={t} />
        ))}
      </View>
    </View>
  );
}

function ContactContent() {
  const { state, setQuery } = useContact();
  const filtered = useMemo(
    () => state.staff.filter((p) => p.name.toLowerCase().includes(state.query.toLowerCase())),
    [state.staff, state.query]
  );

  const staff = filtered.filter((p) => !p.isClient);
  const clients = filtered.filter((p) => p.isClient);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput placeholder="Search" value={state.query} onChangeText={setQuery} style={styles.input} />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>STAFF</Text>
          <Text style={styles.sectionCount}>{staff.length}/{state.staff.filter((p)=>!p.isClient).length}</Text>
        </View>
        {staff.map((p) => (
          <PersonRow key={p.id} name={p.name} online={p.online} tags={p.tags} />
        ))}

        <View style={[styles.sectionHeader, { marginTop: 16 }]}>
          <Text style={styles.sectionLabel}>CLIENT</Text>
        </View>
        {clients.map((p) => (
          <PersonRow key={p.id} name={p.name} online={p.online} />
        ))}
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

export default function ContactScreen() {
  return (
    <ContactProvider>
      <ContactContent />
    </ContactProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 16 },
  searchBox: { marginTop: 10, marginBottom: 10, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 10 },
  input: { paddingHorizontal: 12, paddingVertical: 10 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8, marginBottom: 6 },
  sectionLabel: { color: "#9CA3AF", fontSize: 12, letterSpacing: 0.5 },
  sectionCount: { color: "#9CA3AF", fontSize: 12 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#E5E7EB", marginRight: 12 },
  personName: { fontSize: 16, color: "#111827", fontWeight: "600" },
  personStatus: { fontSize: 12 },
  badge: { backgroundColor: "#EEF2FF", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 6 },
  badgeText: { color: "#6366F1", fontSize: 12, fontWeight: "600" },
});


