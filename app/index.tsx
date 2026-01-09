import { Redirect } from "expo-router";

// <Redirect href="/merchant/(onboarding)/signup-pass" />;
// <Redirect href="/merchant/(onboarding)/signup-pass" />
// <Redirect href="/customer/(home)" />;
export default function Index() {
  return <Redirect href="/customer/(home)" />;
} 
