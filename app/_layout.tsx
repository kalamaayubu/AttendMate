import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { setStatusBarHidden, StatusBar } from "expo-status-bar";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    const goImmersive = async () => {
      try {
        // 🧭 Completely hide Android navigation bar
        await NavigationBar.setVisibilityAsync("hidden");

        // 🔒 Hide the top StatusBar too
        setStatusBarHidden(true, "fade");
      } catch (error) {
        console.warn("Failed to hide navigation/status bar:", error);
      }
    };

    goImmersive();

    // 🧹 Cleanup — restore bars when layout unmounts
    return () => {
      setStatusBarHidden(false, "fade");
      NavigationBar.setVisibilityAsync("visible");
    };
  }, []);

  return (
    <>
      <StatusBar hidden />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Home screen */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* Auth group (login, signup, etc.) */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
