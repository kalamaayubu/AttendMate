import { supabase } from "@/lib/supabase";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { AppState } from "react-native";

export default function RootLayout() {
  // Hide navigation bars
  useEffect(() => {
    const goImmersive = async () => {
      try {
        // Completely hide Android navigation bar
        await NavigationBar.setVisibilityAsync("hidden");
      } catch (error) {
        console.warn("Failed to hide navigation/status bar:", error);
      }
    };

    goImmersive();

    // 🧹 Cleanup — restore bars when layout unmounts
    return () => {
      NavigationBar.setVisibilityAsync("visible");
    };
  }, []);

  // Manage supabase token refresh based on app lifecycle
  useEffect(() => {
    // Subscribe to app lifecycle changes
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        supabase.auth.startAutoRefresh(); // Keep session alive
      } else {
        supabase.auth.stopAutoRefresh(); // Pause refresh in background
      }
    });

    // Cleanup listener on unmount
    return () => subscription.remove();
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Home screen */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        {/* Auth group (login, signup, etc.) */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
