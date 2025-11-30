import { Stack } from "expo-router";
import React from "react";

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ animation: 'none' }}>
      <Stack.Screen name="settings-general" options={{ headerShown: false }} />
      <Stack.Screen name="settings-notifications" options={{ headerShown: false }} />
      <Stack.Screen name="settings-profile" options={{ headerShown: false }} />
      <Stack.Screen name="settings-security" options={{ headerShown: false }} />
      <Stack.Screen name="settings-staffmanagement" options={{ headerShown: false }} />
      <Stack.Screen name="settings-staffedit" options={{ headerShown: false }} />
      <Stack.Screen name="settings-staff-add" options={{ headerShown: false }} />
    </Stack>
  );
}


