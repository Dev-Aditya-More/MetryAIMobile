import { router } from "expo-router";
import { useEffect } from "react";
import { Linking } from "react-native";
import { supabase } from "./supabaseClient";

export function useResetPasswordDeepLink() {
  useEffect(() => {
    // Handler for both runtime and cold start links
    const handleDeepLink = async (url: string | null) => {
      // 1️⃣ Exchange code from magic link for a real session
      if (!url) {
        console.log("No URL found in deep link handler");
        return;
      }
      console.log(url);
      const { data, error } = await supabase.auth.exchangeCodeForSession(url);

      if (error) {
        console.log("Error exchanging code for session:", error.message);
        return;
      }
      console.log("Successfully exchanged code for session:", data.session);

      if (url && url.includes("reset-password")) {
        router.push("/(onboarding)/reset-password");
      }
    };

    // ✅ For Expo SDK 49+, use `Linking.addEventListener('url', callback)` returns a subscription object
    const subscription = Linking.addEventListener("url", (event) => {
      console.log("Deep link URL received:", event.url);
      handleDeepLink(event.url);
    });

    // Handle case when app is opened directly via the reset link (cold start)
    Linking.getInitialURL().then(handleDeepLink);

    // Clean up listener when unmounted
    return () => {
      subscription.remove();
    };
  }, []);
}
