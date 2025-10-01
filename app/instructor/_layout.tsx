import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function InstructorLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#16a34a",
        tabBarInactiveTintColor: "#888",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          elevation: 0,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "home":
              iconName = "home-outline";
              break;
            case "addSchedules":
              iconName = "add-outline";
              break;
            case "schedules":
              iconName = "calendar-outline";
              break;
            default:
              iconName = "ellipse-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="addSchedules" options={{ title: "Add Schedule" }} />
      <Tabs.Screen name="schedules" options={{ title: "Schedules" }} />
    </Tabs>
  );
}
