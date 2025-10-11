import { ProtectedLayout } from "@/components/general/ProtectedLayout";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function InstructorLayout() {
  return (
    <ProtectedLayout allowedRoles={["instructor"]}>
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
          tabBarStyle: {
            height: 60,
          },
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            switch (route.name) {
              case "home":
                iconName = "home-outline";
                break;
              case "schedules":
                iconName = "calendar-outline";
                break;
              case "reports":
                iconName = "document-text-outline";
                break;
              case "courses":
                iconName = "library-outline";
                break;
              default:
                iconName = "ellipse-outline";
            }

            return <Ionicons name={iconName} size={20} color={color} />;
          },
        })}
      >
        <Tabs.Screen name="home" options={{ title: "Home" }} />
        <Tabs.Screen name="schedules" options={{ title: "Schedules" }} />
        <Tabs.Screen name="reports" options={{ title: "Reports" }} />
        <Tabs.Screen name="courses" options={{ title: "Courses" }} />
      </Tabs>
    </ProtectedLayout>
  );
}
