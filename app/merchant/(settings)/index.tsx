import { AuthService } from "@/api/merchant/auth";
import BottomNav from "@/components/BottomNav";
import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await AuthService.getProfile();
        console.log("Profile response:", res);

        if (!res) return;
        const data = res as any;

        const loadedFullName = data.fullName ?? "";
        const loadedAvatarUrl = data.avatarUrl || null;

        setFullName(loadedFullName);
        setAvatarUrl(loadedAvatarUrl);
        setAvatarError(false);
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };

    loadProfile();
  }, []);

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
          (pressed || activeLabel === label) && styles.rowPressed,
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
            {avatarUrl && !avatarError ? (
              <Image
                source={{ uri: avatarUrl }}
                style={styles.profileImage}
                onError={() => setAvatarError(true)}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color="#9CA3AF" />
              </View>
            )}

            <View style={styles.cameraBadge}>
              <Ionicons name="camera-outline" size={16} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.profileName}>{fullName}</Text>
        </View>

        {/* PERSONAL */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>PERSONAL</Text>
          <View style={styles.card}>
            {renderRow(
              "Profile",
              "person-outline",
              "merchant/(settings)/profile" as Href,
              { showBorder: true }
            )}
            {renderRow(
              "Chat",
              "chatbubble-ellipses-outline",
              "merchant/(contact)/" as Href,
              { showBorder: true }
            )}
            {renderRow(
              "Security",
              "lock-closed-outline",
              "merchant/(settings)/security" as Href,
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
              "merchant/(settings)/staff-management" as Href,
              { showBorder: true }
            )}
            {renderRow(
              "Notifications",
              "notifications-outline",
              "merchant/(settings)/notifications" as Href,
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
    backgroundColor: colors.surface,
  },

  scrollContent: {
    paddingBottom: 90,
  },

  /* Profile header */
  profileHeader: {
    backgroundColor: colors.surface,
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
    position: "relative",
  },

  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 48,
  },

  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 48,
    backgroundColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  cameraBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.textPrimary,
    alignItems: "center",
    justifyContent: "center",
  },

  profileName: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  /* Sections */
  sectionBlock: {
    marginTop: 16,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.muted,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
    paddingHorizontal: 16,
  },

  card: {
    backgroundColor: colors.background,
    borderRadius: 10,
    marginHorizontal: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },

  /* Rows */
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },

  rowPressed: {
    backgroundColor: colors.primarySoft,
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
    color: colors.textPrimary,
  },
});
