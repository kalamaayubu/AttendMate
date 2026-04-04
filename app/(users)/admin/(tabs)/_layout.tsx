import {
  AdminMoreMenuProvider,
  useAdminMoreMenu,
} from "@/components/general/AdminMoreMenuContext";
import { ProtectedLayout } from "@/components/general/ProtectedLayout";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";

const BAR_HEIGHT = 70;

function TabIcon({
  focused,
  base,
}: {
  focused: boolean;
  base: "home" | "book" | "ellipsis-horizontal";
}) {
  const iconName: keyof typeof Ionicons.glyphMap =
    base === "ellipsis-horizontal"
      ? "ellipsis-horizontal"
      : focused
        ? base
        : (`${base}-outline` as keyof typeof Ionicons.glyphMap);

  return (
    <View style={[styles.pill, focused && styles.activePill]}>
      <Ionicons
        name={iconName}
        size={22}
        color={focused ? "#FFFFFF" : "#FFF2F0"}
      />
    </View>
  );
}

function AdminTabsInner() {
  const { open } = useAdminMoreMenu();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} base="home" />
          ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} base="book" />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} base="ellipsis-horizontal" />
          ),
        }}
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

export default function AdminLayout() {
  return (
    <ProtectedLayout allowedRoles={["admin"]}>
      <AdminMoreMenuProvider>
        <AdminTabsInner />
      </AdminMoreMenuProvider>
    </ProtectedLayout>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "relative",
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    bottom: Platform.OS === "ios" ? 55 : 45,
    marginHorizontal: "5%",
    width: "90%",
    backgroundColor: "#4f46e5",
    borderRadius: 35,
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    paddingTop: 15,
    paddingHorizontal: 12,
  },
  tabBarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: BAR_HEIGHT,
    paddingTop: 0,
    paddingBottom: 0,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 250,
    height: 56,
    minWidth: 56,
  },
  activePill: {
    backgroundColor: "#4f46e5",
    width: 56,
    height: 56,
  },
});
