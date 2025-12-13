import { colors } from "@/theme/colors";
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

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "./chat",
          params: { userId: id, name, avatar },
        })
      }
      style={styles.row}
    >
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
            { color: online ? colors.success : colors.muted },
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

/* ---------------- Content ---------------- */
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
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={colors.textPrimary}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Contacts</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search"
          placeholderTextColor={colors.muted}
          value={state.query}
          onChangeText={setQuery}
          style={styles.input}
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* STAFF */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>STAFF</Text>
        </View>

        {staff.map((p) => (
          <PersonRow key={p.id} {...p} isClient={false} />
        ))}

        {/* CLIENT */}
        <View style={[styles.sectionHeader, { marginTop: 16 }]}>
          <Text style={styles.sectionLabel}>CLIENT</Text>
        </View>

        {clients.map((p) => (
          <PersonRow key={p.id} {...p} isClient />
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  /* Search */
  searchBox: {
    margin: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  input: {
    padding: 12,
    fontSize: 15,
    color: colors.textPrimary,
  },

  /* Section */
  sectionHeader: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 6,
  },
  sectionLabel: {
    color: colors.muted,
    fontSize: 12,
    letterSpacing: 0.5,
  },

  /* Row */
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },

  personName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  personStatus: {
    fontSize: 12,
    marginTop: 2,
  },

  /* Badge */
  badge: {
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "600",
  },
});
