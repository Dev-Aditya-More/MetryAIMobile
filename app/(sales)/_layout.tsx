// app/(sales)/_layout.tsx

import { Stack } from "expo-router";
import React from "react";
import { BookingProvider } from "./context/SalesContext"; // ✅ CORRECT PROVIDER

export default function SalesLayout() {
  return (
    <BookingProvider>
      <Stack screenOptions={{ animation: "none", headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="order-sent" />
        <Stack.Screen name="order-summary" />
      </Stack>
    </BookingProvider>
  );
}
