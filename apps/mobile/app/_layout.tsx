import "../global.css";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { convex } from "@/lib/convex";
import { secureStorage } from "@/lib/secureStorage";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ConvexAuthProvider client={convex} storage={secureStorage}>
        <StatusBar style="auto" />
        <Slot />
      </ConvexAuthProvider>
    </SafeAreaProvider>
  );
}
