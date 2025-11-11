import { router } from 'expo-router';
import { useEffect } from 'react';
import { Linking } from 'react-native';

export function useResetPasswordDeepLink() {
  useEffect(() => {
    // Handler for both runtime and cold start links
    const handleDeepLink = (url: string | null) => {
      if (url && url.includes('reset-password')) {
        router.push('/(onboarding)/reset-password');
      }
    };

    // ✅ For Expo SDK 49+, use `Linking.addEventListener('url', callback)` returns a subscription object
    const subscription = Linking.addEventListener('url', (event) => {
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
