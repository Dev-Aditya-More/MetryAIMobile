import { Stack } from "expo-router";
import React from "react";


export default function RegisterBusinessLayout() {
    return (
        <Stack screenOptions={{ animation: 'none', headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    );
}


