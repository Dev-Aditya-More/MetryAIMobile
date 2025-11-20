import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

export default function ChatScreen() {
  const route = useRoute();
  const { name, avatar } = route.params as { name: string; avatar?: string };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Image
            source={{ uri: avatar || "https://via.placeholder.com/150" }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.online}>Online</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <Ionicons name="call-outline" size={22} color="#111" style={{ marginHorizontal: 10 }} />
          <Ionicons name="videocam-outline" size={22} color="#111" style={{ marginHorizontal: 10 }} />
          <Ionicons name="ellipsis-vertical" size={22} color="#111" style={{ marginLeft: 6 }} />
        </View>
      </View>

      {/* MESSAGES AREA (EMPTY FOR NOW) */}
      <ScrollView style={styles.messages}>
        {/* Empty state */}
        <View style={{ paddingTop: 20, alignItems: "center" }}>
          <Text style={{ color: "#9CA3AF" }}>Start a conversation...</Text>
        </View>
      </ScrollView>

      {/* INPUT BAR */}
      <View style={styles.inputBar}>
        <TouchableOpacity>
          <Ionicons name="happy-outline" size={26} color="#6B7280" />
        </TouchableOpacity>

        <TextInput placeholder="Type a message.." style={styles.input} />

        <TouchableOpacity>
          <Ionicons name="camera-outline" size={26} color="#6B7280" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.sendButton}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  /** HEADER **/
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 16,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  name: { fontSize: 16, fontWeight: "600", color: "#111" },
  online: { fontSize: 12, color: "#10B981" },

  /** MESSAGES AREA **/
  messages: { flex: 1, paddingHorizontal: 16 },

  /** INPUT BAR **/
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
  },
  sendButton: {
    backgroundColor: "#6366F1",
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
});
