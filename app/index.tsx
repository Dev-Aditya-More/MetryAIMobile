import { Href, Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [target, setTarget] = useState<Href | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const SecureStore = (require("expo-secure-store") as any).default || require("expo-secure-store");
        const value = await SecureStore.getItemAsync?.("onboarding_completed");
        const href: Href = value === "true" ? ("/(home)" as Href) : ("/(onboarding)/signup-phone" as Href);
        if (isMounted) setTarget(href);
      } catch {
        if (isMounted) setTarget("/(onboarding)/signup-phone" as Href);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  
  if (!target) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#E9F2FB",
        }}
      >
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  return <Redirect href={target} />;
}
