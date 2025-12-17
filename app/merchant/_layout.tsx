import { Stack } from "expo-router";

export default function MerchantLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: "none" }}>
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(reservation)" />
            <Stack.Screen name="(home)" />
            <Stack.Screen name="(contact)" />
            <Stack.Screen name="(calendar)" />
            <Stack.Screen name="(sales)" />
            <Stack.Screen name="(products)" />
            <Stack.Screen name="(settings)" />
        </Stack>
    );
}
