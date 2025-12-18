import { Stack } from "expo-router";
import React from "react";

export default function ServicesLayout() {
    return (
        <Stack screenOptions={{ animation: 'none', headerShown: false }}>
            <Stack.Screen name="index" />
        </Stack>
    );
}


