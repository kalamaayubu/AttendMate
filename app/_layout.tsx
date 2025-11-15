/* eslint-disable import/first */
// Conditionally load Reactotron before anything else in dev
if (__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("../ReactotronConfig");
}

import CustomToast from "@/components/general/CustomToast";
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
  // Set Navigation Bar (Android)
  useEffect(() => {
    NavigationBar.setVisibilityAsync("visible");
    NavigationBar.setPositionAsync("relative");
    NavigationBar.setBackgroundColorAsync("#ffffff"); // light background
    NavigationBar.setButtonStyleAsync("dark"); // dark icons
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
              <ActivityIndicator size="large" color="#6366f1" />
            </View>
          }
          persistor={persistor}
        >
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            {/* Home screen */}
            <Stack.Screen name="index" options={{ headerShown: false }} />
            {/* Auth group (login, signup, etc.) */}
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack>

          {/* Toast notification provider */}
          <Toast
            config={{
              success: CustomToast,
              error: CustomToast,
              info: CustomToast,
            }}
            position="bottom"
            visibilityTime={6000}
            autoHide
            bottomOffset={50}
            swipeable
          />
        </PersistGate>
      </Provider>
    </>
  );
}
