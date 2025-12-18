import { Stack } from "expo-router";
import React from "react";

export default function BookingLayout() {
    return (
        <Stack screenOptions={{ animation: 'none', headerShown: false }}>
            <Stack.Screen name="index" />
        </Stack>
    );
}


