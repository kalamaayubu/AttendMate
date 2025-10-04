import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function StudentLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#16a34a",
        tabBarInactiveTintColor: "#888",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          elevation: 0,
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
            case "notifications":
              iconName = "notifications-outline";
              break;
            default:
              iconName = "ellipse-outline";
          }

          return <Ionicons name={iconName} size={20} color={color} />;
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
        name="notifications"
        options={{ title: "Alerts", headerShown: false }}
      />
    </Tabs>
  );
}
