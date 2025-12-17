import { Stack } from "expo-router";
import React from "react";

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ animation: 'none' }}>
      <Stack.Screen name="general" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="security" options={{ headerShown: false }} />
      <Stack.Screen name="staff-management" options={{ headerShown: false }} />
      <Stack.Screen name="staff-edit" options={{ headerShown: false }} />
      <Stack.Screen name="staff-add" options={{ headerShown: false }} />
    </Stack>
  );
}


