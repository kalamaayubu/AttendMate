import { ProtectedLayout } from "@/components/general/ProtectedLayout";
import NotificationPermissionHandler from "@/lib/firebase/NotificationPermissionHandler";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function StudentLayout() {
  return (
    <ProtectedLayout allowedRoles={["student"]}>
      {/* Notification handler */}
      <NotificationPermissionHandler />

      <Tabs
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "#6663f1",
          tabBarInactiveTintColor: "#888",
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "600",
            elevation: 0,
          },
          tabBarStyle: {
            height: 60,
          },
          tabBarIcon: ({ color }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            switch (route.name) {
              case "home":
                iconName = "grid-outline";
                break;
              case "schedules/index":
                iconName = "calendar-outline";
                break;
              case "courses":
                iconName = "book-outline";
                break;
              case "notifications":
                iconName = "notifications-outline";
                break;
              default:
                iconName = "ellipse-outline";
            }

            return <Ionicons name={iconName} size={18} color={color} />;
          },
        })}
      >
        <Tabs.Screen
          name="home"
          options={{ title: "Dashboard", headerShown: false }}
        />
        <Tabs.Screen
          name="schedules/index"
          options={{ title: "Schedules", headerShown: false }}
        />
        <Tabs.Screen
          name="courses"
          options={{ title: "Courses", headerShown: false }}
        />
        <Tabs.Screen
          name="notifications"
          options={{ title: "Alerts", headerShown: false }}
        />
      </Tabs>
    </ProtectedLayout>
  );
}
