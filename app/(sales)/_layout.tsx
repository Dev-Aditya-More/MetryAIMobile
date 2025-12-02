import { Stack } from "expo-router";
import React from "react";

export default function SalesLayout() {
  return (
    <Stack screenOptions={{ animation: 'none',headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}


