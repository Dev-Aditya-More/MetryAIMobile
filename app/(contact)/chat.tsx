import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ContactProvider, useContact } from "./_context/ContactContext";

/* ---------------- Badge ---------------- */
function Badge({ label }: { label: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

/* ---------------- Person Row ---------------- */
function PersonRow({
  id,
  name,
  online,
  tags,
  avatar,
  isClient,
}: {
  id: string;
  name: string;
  online: boolean;
  tags?: string[];
  avatar?: string;
  isClient?: boolean;
}) {
  const router = useRouter();

  const openChat = () => {
    router.push({
      pathname: "./chat",
      params: { userId: id, name, avatar },
    });
  };

  return (
    <Pressable onPress={openChat} style={styles.row}>
      <Image
        source={{
          uri:
            avatar ||
            "https://i.pravatar.cc/150?img=" +
              (parseInt(id.replace(/\D/g, "")) % 70),
        }}
        style={styles.avatar}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.personName}>{name}</Text>
        <Text
          style={[
            styles.personStatus,
            { color: online ? "#10B981" : "#6B7280" },
          ]}
        >
          {online ? "Online" : "Offline"}
        </Text>
      </View>

      {!isClient && (
        <View style={{ flexDirection: "row", gap: 6 }}>
          {tags?.map((t, i) => (
            <Badge key={i} label={t} />
          ))}
        </View>
      )}
    </Pressable>
  );
}

/* ---------------- Main Content ---------------- */
function ContactContent() {
  const { state, setQuery } = useContact();
  const router = useRouter();

  const filtered = useMemo(
    () =>
      state.staff.filter((p) =>
        p.name.toLowerCase().includes(state.query.toLowerCase())
      ),
    [state.staff, state.query]
  );

  const staff = filtered.filter((p) => !p.isClient);
  const clients = filtered.filter((p) => p.isClient);

  return (
    <SafeAreaView style={styles.container}>
      {/* ---------- HEADER (Chat-style) ---------- */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/(home)")}
          hitSlop={20}
        >
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Contacts</Text>
        </View>

        {/* Right spacer for symmetry */}
        <View style={{ width: 24 }} />
      </View>

      {/* ---------- Search Bar ---------- */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search"
          value={state.query}
          onChangeText={setQuery}
          style={styles.input}
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* STAFF SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>STAFF</Text>
          <Text style={styles.sectionCount}>
            {staff.length}/{state.staff.filter((p) => !p.isClient).length}
          </Text>
        </View>

        {staff.map((p) => (
          <PersonRow
            key={p.id}
            id={p.id}
            name={p.name}
            online={p.online}
            tags={p.tags}
            avatar={p.avatar}
            isClient={false}
          />
        ))}

        {/* CLIENT SECTION */}
        <View style={[styles.sectionHeader, { marginTop: 16 }]}>
          <Text style={styles.sectionLabel}>CLIENT</Text>
        </View>

        {clients.map((p) => (
          <PersonRow
            key={p.id}
            id={p.id}
            name={p.name}
            online={p.online}
            avatar={p.avatar}
            isClient={true}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- Screen Wrapper ---------------- */
export default function ContactScreen() {
  return (
    <ContactProvider>
      <ContactContent />
    </ContactProvider>
  );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },

  /* Search */
  searchBox: {
    margin: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  /* Sections */
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 6,
  },
  sectionLabel: { color: "#9CA3AF", fontSize: 12, letterSpacing: 0.5 },
  sectionCount: { color: "#9CA3AF", fontSize: 12 },

  /* Rows */
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },

  personName: { fontSize: 16, color: "#111827", fontWeight: "600" },
  personStatus: { fontSize: 12, marginTop: 2 },

  /* Badge */
  badge: {
    backgroundColor: "#FFE8CC",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { color: "#FB923C", fontSize: 12, fontWeight: "600" },
});
