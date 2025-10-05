import CustomHeader from "@/components/general/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Demo notifications
const notifications = [
  {
    id: "1",
    title: "New Assignment Posted",
    description: "Math 101 assignment 2 is now available.",
    time: "2h ago",
    read: false,
  },
  {
    id: "2",
    title: "Class Canceled",
    description: "Physics 201 class has been canceled today.",
    time: "1d ago",
    read: true,
  },
  {
    id: "3",
    title: "Attendance Reminder",
    description: "Don't forget to mark your attendance for Chemistry 101.",
    time: "3d ago",
    read: false,
  },
];

export default function Notifications() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <CustomHeader title="Notifications" />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {notifications.map((item) => (
          <TouchableOpacity
            key={item.id}
            className={`flex-row items-start bg-white rounded-2xl p-4 mb-3 shadow ${item.read ? "" : "border-l-4 border-indigo-500"}`}
            activeOpacity={0.8}
          >
            {/* Icon */}
            <View className="w-10 h-10 rounded-full bg-indigo-100 items-center justify-center mr-4">
              <Ionicons
                name={item.read ? "notifications-outline" : "notifications"}
                size={22}
                color={item.read ? "#6366f1" : "#4f46e5"}
              />
            </View>

            {/* Content */}
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-800">
                {item.title}
              </Text>
              <Text className="text-sm text-gray-600 mt-1">
                {item.description}
              </Text>
              <Text className="text-xs text-gray-400 mt-1">{item.time}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Empty state */}
        {notifications.length === 0 && (
          <View className="mt-20 items-center justify-center">
            <Ionicons
              name="notifications-off-outline"
              size={48}
              color="#a1a1aa"
            />
            <Text className="mt-4 text-gray-500 text-center text-base">
              You have no notifications yet.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
