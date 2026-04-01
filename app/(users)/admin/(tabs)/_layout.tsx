import { ProtectedLayout } from "@/components/general/ProtectedLayout";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";

export default function AdminLayout() {
  const BAR_HEIGHT = 70; // Standardized height for consistency

  return (
    <ProtectedLayout allowedRoles={["admin"]}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: [styles.tabBar, { height: BAR_HEIGHT }],
          tabBarItemStyle: {
            height: BAR_HEIGHT, // Match the bar height exactly
            paddingTop: 0,
            paddingBottom: 0,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabButton focused={focused} icon="home" />
            ),
          }}
        />
        <Tabs.Screen
          name="courses"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabButton focused={focused} icon="book" />
            ),
          }}
        />
      </Tabs>
    </ProtectedLayout>
  );
}

function TabButton({ focused, icon }) {
  return (
    // Remove the extra container View that was causing flex-squashing
    <View style={[styles.pill, focused && styles.activePill]}>
      <Ionicons
        name={focused ? (icon as any) : `${icon}-outline`}
        size={22} // Slightly smaller for better fit
        color={focused ? "#FFFFFF" : "#FFF2F0"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "relative",
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    bottom: Platform.OS === "ios" ? 55 : 45,
    marginHorizontal: "5%",
    width: "90%",
    backgroundColor: "#000000",
    borderRadius: 35,
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    // paddingHorizontal: 10,
    paddingTop: 15,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 250,
    height: 56, // Explicit height for the pill
    minWidth: 56,
  },
  activePill: {
    backgroundColor: "#4f46e5",
    width: 56,
    height: 56,
  },
});
