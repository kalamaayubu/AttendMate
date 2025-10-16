/* eslint-disable import/first */
// Conditionally load Reactotron before anything else in dev
if (__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("../ReactotronConfig");
}

import NotificationPermissionHandler from "@/lib/firebase/NotificationPermissionHandler";
import { supabase } from "@/lib/supabase";
import { persistor, store } from "@/redux/store";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, AppState, View } from "react-native";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

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
      <Provider store={store}>
        <PersistGate
          loading={
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#16a34a" />
            </View>
          }
          persistor={persistor}
        >
          {/* Notification handler */}
          <NotificationPermissionHandler />
          <Stack screenOptions={{ headerShown: false }}>
            {/* Home screen */}
            <Stack.Screen name="index" options={{ headerShown: false }} />
            {/* Auth group (login, signup, etc.) */}
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack>

          {/* Toast notification provider */}
          <Toast
            position="top"
            visibilityTime={6000}
            autoHide
            topOffset={80}
            swipeable
          />
        </PersistGate>
      </Provider>
    </>
  );
}
