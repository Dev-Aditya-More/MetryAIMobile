import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useResetPasswordDeepLink } from "../api/deepLinkHeandler";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useResetPasswordDeepLink();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ animation: "none" }}>
        {/* here the order of the screens is important for android to work properly */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="merchant" options={{ headerShown: false }} />
        <Stack.Screen name="customer" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
