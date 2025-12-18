import { Stack } from "expo-router";
import { View } from "react-native";
import BottomNav from "./bottomNavBar";

export default function CustomerLayout() {
    return (
        <View style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false, animation: "none" }}>
                <Stack.Screen name="(home)" />
                <Stack.Screen name="(services)" />
                <Stack.Screen name="(booking)" />
                <Stack.Screen name="(settings)" />
            </Stack>
            <BottomNav />
        </View>
    );
}
