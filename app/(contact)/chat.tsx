import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  const router = useRouter();
  const { name, avatar } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={20}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Image
            source={{
              uri: (avatar as string) || "https://via.placeholder.com/150",
            }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.online}>Online</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <Ionicons name="call-outline" size={22} color={colors.textPrimary} />
          <Ionicons
            name="videocam-outline"
            size={22}
            color={colors.textPrimary}
          />
          <Ionicons
            name="ellipsis-vertical"
            size={22}
            color={colors.textPrimary}
          />
        </View>
      </View>

      {/* Messages */}
      <ScrollView style={styles.messages}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Start a conversation...</Text>
        </View>
      </ScrollView>

      {/* Input */}
      <View style={styles.inputBar}>
        <Ionicons name="happy-outline" size={26} color={colors.textSecondary} />

        <TextInput
          placeholder="Type a message..."
          placeholderTextColor={colors.muted}
          style={styles.input}
        />

        <Ionicons
          name="camera-outline"
          size={26}
          color={colors.textSecondary}
        />

        <TouchableOpacity style={styles.sendButton}>
          <Ionicons name="send" size={22} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 12,
  },

  headerActions: { flexDirection: "row" },

  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  name: { fontSize: 16, fontWeight: "600", color: colors.textPrimary },
  online: { fontSize: 12, color: colors.primary },

  messages: { flex: 1, paddingHorizontal: 16 },

  emptyState: { marginTop: 20, alignItems: "center" },
  emptyText: { color: colors.muted },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  input: {
    flex: 1,
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: colors.surface,
    borderRadius: 20,
  },

  sendButton: {
    backgroundColor: colors.primary,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
});
