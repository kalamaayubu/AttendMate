import CustomHeader from "@/components/general/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import { Pressable, SafeAreaView, SectionList, Text, View } from "react-native";

const tabs = ["All", "Today", "Upcoming"];

const scheduleData = [
  {
    title: "Today",
    data: [
      {
        id: "1",
        course: "Math 101",
        time: "08:00 AM - 09:30 AM",
        location: "Room A2",
        instructor: "Prof. Kimani",
        color: "#3b82f6",
      },
      {
        id: "2",
        course: "Physics 202",
        time: "11:00 AM - 12:30 PM",
        location: "Lab B1",
        instructor: "Dr. Mwangi",
        color: "#16a34a",
      },
    ],
  },
  {
    title: "Tomorrow",
    data: [
      {
        id: "3",
        course: "Chemistry 103",
        time: "09:00 AM - 10:30 AM",
        location: "Room C3",
        instructor: "Dr. Njeri",
        color: "#f59e0b",
      },
      {
        id: "4",
        course: "Computer Science 204",
        time: "02:00 PM - 03:30 PM",
        location: "Lab D2",
        instructor: "Eng. Otieno",
        color: "#8b5cf6",
      },
    ],
  },
];

export default function Schedules() {
  const [activeTab, setActiveTab] = useState("All");

  // Filter based on tab
  const filteredData =
    activeTab === "All"
      ? scheduleData
      : scheduleData.filter((section) =>
          activeTab === "Today"
            ? section.title === "Today"
            : section.title !== "Today"
        );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView className="flex-1 bg-gray-50">
        {/* ===== Header ===== */}
        <CustomHeader title="Schedules" />

        {/* ===== Tabs ===== */}
        <View className="flex-row justify-start px-4 bg-white shadow-sm py-3">
          {tabs.map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full ${
                activeTab === tab ? "bg-green-600" : "bg-transparent"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  activeTab === tab ? "text-white" : "text-gray-600"
                }`}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ===== Schedule List ===== */}
        <SectionList
          sections={filteredData}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          renderSectionHeader={({ section: { title } }) => (
            <Text className="text-lg font-semibold text-gray-800 mt-6 mb-3">
              {title}
            </Text>
          )}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/student/schedules/${item.id}`)} // dynamic route
              className="bg-white rounded-2xl shadow-sm p-4 mb-4 flex-row items-center"
              style={{
                borderLeftWidth: 5,
                borderLeftColor: item.color,
              }}
            >
              {/* Icon */}
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: item.color + "20" }}
              >
                <Ionicons name="book-outline" size={24} color={item.color} />
              </View>

              {/* Details */}
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-800">
                  {item.course}
                </Text>
                <Text className="text-sm text-gray-600">{item.time}</Text>
                <Text className="text-xs text-gray-500">
                  {item.location} • {item.instructor}
                </Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-20">
              No schedules found.
            </Text>
          }
        />
      </SafeAreaView>
    </>
  );
}
