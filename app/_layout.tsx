import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Home screen */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* Auth group (login, signup, etc.) */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}
