import { useMoreMenu } from "@/components/general/MoreMenuContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function StudentTabsNavigator() {
  const { open } = useMoreMenu();

  return (
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
          height: 68,
          paddingHorizontal: 4,
          backgroundColor: "#ffffff",
          borderBottomWidth: 1,
          borderBottomColor: "#f3f4f6",
          marginBottom: 44,
          borderTopRightRadius: 18,
          borderTopLeftRadius: 18,
          elevation: 1,
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
            case "more":
              iconName = "ellipsis-vertical";
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
        name="courses"
        options={{ title: "Courses", headerShown: false }}
      />
      <Tabs.Screen
        name="more"
        options={{ title: "More", headerShown: false }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            open();
          },
        }}
      />
    </Tabs>
  );
}
