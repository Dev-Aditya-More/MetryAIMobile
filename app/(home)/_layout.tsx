import { Stack } from "expo-router";
import React from "react";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ animation: 'none' }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}


