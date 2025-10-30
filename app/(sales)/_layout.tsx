import { Stack } from "expo-router";
import React from "react";
import { BookingProvider } from "./context/SalesContext";

export default function SalesLayout() {
  return (
    <BookingProvider>
    <Stack screenOptions={{ animation: 'none',headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
       <Stack.Screen name="order-sent" options={{ headerShown: false }} />
        <Stack.Screen name="order-summary" options={{ headerShown: false }} />
    </Stack>
    </BookingProvider>
  );
}


