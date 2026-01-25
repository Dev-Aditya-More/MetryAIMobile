import { Stack } from "expo-router";

export default function OnboardingLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
            <Stack.Screen name="signup-pass" />
            <Stack.Screen name="login" />
            <Stack.Screen name="profile-setup" />
            <Stack.Screen name="forget-pass" />
        </Stack>
    );
}
