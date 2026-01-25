import { Stack, useSegments } from "expo-router";
import { View } from "react-native";
import BottomNav from "./bottomNavBar";

export default function CustomerLayout() {
    const segments = useSegments();
    // Check if we are in the onboarding flow; segments might look like ['customer', '(onboarding)', 'signup-pass']
    // Note: The segments array contains the route segment names.
    const hideNav = segments.some(s => s === "(onboarding)");

    return (
        <View style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false, animation: "none" }}>
                <Stack.Screen name="(home)" />
                <Stack.Screen name="(services)" />
                <Stack.Screen name="(booking)" />
                <Stack.Screen name="(settings)" />
                <Stack.Screen name="(onboarding)" />
            </Stack>
            {!hideNav && <BottomNav />}
        </View>
    );
}
