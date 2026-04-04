import { MoreMenuProvider } from "@/components/general/MoreMenuContext";
import { ProtectedLayout } from "@/components/general/ProtectedLayout";
import NotificationPermissionHandler from "@/lib/firebase/NotificationPermissionHandler";
import { Stack } from "expo-router";

export default function StudentLayout() {
  return (
    <ProtectedLayout allowedRoles={["student"]}>
      <NotificationPermissionHandler />
      <MoreMenuProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="schedules/[scheduleId]" />
        </Stack>
      </MoreMenuProvider>
    </ProtectedLayout>
  );
}
