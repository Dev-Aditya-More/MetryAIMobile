import { Stack } from "expo-router";

export default function CustomerLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: "none" }}>
            <Stack.Screen name="" />
        </Stack>
    );
}
