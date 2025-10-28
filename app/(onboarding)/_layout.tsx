import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
      <Stack.Screen name="signup-phone" />
      <Stack.Screen name="signup-email" />
      <Stack.Screen name="otp-phone" />
      <Stack.Screen name="otp-email" />
      <Stack.Screen name="profile-setup" />
    </Stack>
  );
}