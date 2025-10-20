import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      // router.replace("/(onboarding)/signup-phone");
      router.replace("/(reservation)/select-service");
    }, 100); // small delay to ensure RootLayout mounts

    return () => clearTimeout(timeout);
  }, [router]);

  
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
