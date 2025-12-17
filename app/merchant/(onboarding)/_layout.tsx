import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
      {/* here the order of the screens is important for android to work properly */}
      <Stack.Screen name="signup-phone" />
      <Stack.Screen name="signup-email" />
      <Stack.Screen name="otp-phone" />
      <Stack.Screen name="otp-email" />
      <Stack.Screen name="profile-setup" />
      <Stack.Screen name="signup-pass" />
      <Stack.Screen name="login" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="register-business" />
    </Stack>
  );
}