import { Stack } from "expo-router";
import React from "react";

export default function SettingsLayout() {
    return (
        <Stack screenOptions={{ animation: 'none', headerShown: false }}>
            <Stack.Screen name="index" />
        </Stack>
    );
}


