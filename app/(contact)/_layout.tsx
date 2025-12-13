import { Stack } from "expo-router";
import React from "react";

export default function ContactLayout() {
  return (
    <Stack screenOptions={{ animation: 'none'}}>
      <Stack.Screen
        name="index"
       options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="chat"
        options={{
          headerShown: false,

        }}
      />
    </Stack>
  );
}


