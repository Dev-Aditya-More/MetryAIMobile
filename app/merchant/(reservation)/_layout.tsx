import { Stack } from "expo-router";
import { BookingProvider } from "./_context/ReservationContext";
export default function OnboardingLayout() {
  return (
    <BookingProvider>
    <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
      <Stack.Screen name="select-service" />
      <Stack.Screen name="select-staff" />
      <Stack.Screen name="select-date-time" />
      <Stack.Screen name="customer-details" />
      <Stack.Screen name="confirm-booking" />
    </Stack>
    </BookingProvider>
  );
}