import profieImg from "@/assets/images/profile.jpg";
import BottomNav from "@/components/BottomNav";
import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const router = useRouter();
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const renderRow = (
    label: string,
    icon: keyof typeof Ionicons.glyphMap,
    href: Href,
    options?: { showBorder?: boolean }
  ) => {
    const showBorder = options?.showBorder ?? true;

    return (
      <Pressable
        key={label}
        onPressIn={() => setActiveLabel(label)}
        onPressOut={() => setActiveLabel(null)}
        onPress={() => router.push(href)}
        style={({ pressed }) => [
          styles.row,
          !showBorder && styles.rowNoBorder,
          (pressed || activeLabel === label) && styles.rowPressed, // 👈 stronger feedback
        ]}
      >
        <View style={styles.rowLeft}>
          <Ionicons
            name={icon}
            size={20}
            color="#111827"
            style={styles.rowIcon}
          />
          <Text style={styles.rowLabel}>{label}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top profile area */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <Image source={profieImg} style={styles.profileImage} />
            <View style={styles.cameraBadge}>
              <Ionicons name="camera-outline" size={16} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.profileName}>Viraj Shah</Text>
        </View>

        {/* PERSONAL */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>PERSONAL</Text>
          <View style={styles.card}>
            {renderRow(
              "Profile",
              "person-outline",
              "/(settings)/settings-profile" as Href,
              { showBorder: true }
            )}
            {renderRow(
              "General",
              "settings-outline",
              "/(settings)/settings-general" as Href,
              { showBorder: true }
            )}
            {renderRow(
              "Security",
              "lock-closed-outline",
              "/(settings)/settings-security" as Href,
              { showBorder: false }
            )}
          </View>
        </View>

        {/* WORKSPACE */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>WORKSPACE</Text>
          <View style={styles.card}>
            {renderRow(
              "Staff Management",
              "people-outline",
              "/(settings)/settings-staffmanagement" as Href,
              { showBorder: true }
            )}
            {renderRow(
              "Notifications",
              "notifications-outline",
              "/(settings)/settings-notifications" as Href,
              { showBorder: false }
            )}
          </View>
        </View>
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

/* ------------------------------ STYLES ------------------------------ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  scrollContent: {
    paddingBottom: 90, // space above bottom nav
  },

  /* Profile header */
  profileHeader: {
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 24,
  },
  avatarWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 48,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  profileName: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  /* Sections */
  sectionBlock: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginHorizontal: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  /* Rows */
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  rowPressed: {
    backgroundColor: "#E5E7EB", // grey feedback when pressed
  },
  rowNoBorder: {
    borderBottomWidth: 0,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rowIcon: {
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 15,
    color: "#111827",
  },
});
