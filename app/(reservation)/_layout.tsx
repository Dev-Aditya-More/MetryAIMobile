import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="select-service" />
      <Stack.Screen name="select-staff" />
      <Stack.Screen name="select-date-time" />
      <Stack.Screen name="customer-details" />
      <Stack.Screen name="confirm-booking" />
    </Stack>
  );
}