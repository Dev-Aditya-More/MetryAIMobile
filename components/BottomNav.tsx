import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter, useSegments } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type TabKey =
  | "home"
  | "calendar"
  | "contact"
  | "services"
  | "settings"
  | "sales"; // NEW

export default function BottomNav() {
  const segments = useSegments();
  const router = useRouter();

  const has = (g: string) => (segments as unknown as string[]).includes(g);

  const active: TabKey = has("(home)")
    ? "home"
    : has("(calendar)")
    ? "calendar"
    : has("(contact)")
    ? "contact"
    : has("(products)")
    ? "services"
    : has("(sales)") // NEW
    ? "sales"
    : has("(settings)")
    ? "settings"
    : "home";

  const go = (key: TabKey) => {
    if (key === "home") router.replace("/(home)" as Href);
    if (key === "calendar") router.replace("/(calendar)" as Href);
    if (key === "contact") router.replace("/(contact)" as Href);
    if (key === "services") router.replace("/(products)" as Href);
    if (key === "sales") router.replace("/(sales)" as Href); // NEW
    if (key === "settings") router.replace("/(settings)" as Href);
  };

  const item = (
    key: TabKey,
    iconInactive: keyof typeof Ionicons.glyphMap,
    iconActive: keyof typeof Ionicons.glyphMap,
    label: string
  ) => (
    <TouchableOpacity
      key={key}
      style={styles.tab}
      activeOpacity={0.8}
      onPress={() => go(key)}
    >
      <Ionicons
        name={active === key ? iconActive : iconInactive}
        size={22}
        color={active === key ? "#BFA78A" : "#D1D5DB"}
      />
      <Text
        style={[
          styles.label,
          { color: active === key ? "#6B7280" : "#D1D5DB" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      {item("home", "home-outline", "home", "Home")}
      {/* {item("contact", "chatbubble-ellipses-outline", "chatbubble", "Contacts")} */}
      {item("calendar", "calendar-outline", "calendar", "Calendar")}
      {item("sales", "add-circle-outline", "add-circle", "Book")}
      {item("services", "cash-outline", "cash", "Services")}
      {item("settings", "settings-outline", "settings", "Settings")}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    marginTop: 4,
  },
});
