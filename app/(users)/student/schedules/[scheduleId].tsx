import CustomHeader from "@/components/general/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

export default function ScheduleDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  // You’d normally fetch the class by id from state/server

  // Demo data
  const classInfo = {
    course: "Math 101",
    time: "08:00 AM - 09:30 AM",
    date: "Today, 4th Oct",
    location: "Room A2",
    instructor: "Prof. Kimani",
    color: "#3b82f6",
    description:
      "This class covers algebraic functions and their applications in physics.",
    attendance: { total: 12, attended: 10 },
  };

  return (
    <>
      {/* Hide default stack header */}
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView className="flex-1 bg-gray-50">
        <CustomHeader title={`${classInfo.course}`} />
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {/* Header Card */}
          <View
            className="bg-white rounded-2xl shadow p-4 mb-4"
            style={{ borderLeftWidth: 5, borderLeftColor: classInfo.color }}
          >
            <Text className="text-xl font-bold text-gray-800 mb-1">
              {classInfo.course}
            </Text>
            <Text className="text-sm text-gray-600">{classInfo.date}</Text>
            <Text className="text-sm text-gray-600">{classInfo.time}</Text>

            <View className="flex-row items-center mt-2">
              <Ionicons
                name="location-outline"
                size={16}
                color={classInfo.color}
              />
              <Text className="ml-1 text-sm text-gray-700">
                {classInfo.location}
              </Text>
            </View>

            <View className="flex-row items-center mt-1">
              <Ionicons
                name="person-outline"
                size={16}
                color={classInfo.color}
              />
              <Text className="ml-1 text-sm text-gray-700">
                {classInfo.instructor}
              </Text>
            </View>
          </View>

          {/* Description */}
          <View className="bg-white rounded-2xl shadow p-4 mb-4">
            <Text className="text-base font-semibold text-gray-800 mb-2">
              About this class
            </Text>
            <Text className="text-sm text-gray-600 leading-5">
              {classInfo.description}
            </Text>
          </View>

          {/* Attendance */}
          <View className="bg-white rounded-2xl shadow p-4">
            <Text className="text-base font-semibold text-gray-800 mb-2">
              Attendance
            </Text>
            <Text className="text-sm text-gray-600">
              Total Sessions: {classInfo.attendance.total}
            </Text>
            <Text className="text-sm text-gray-600">
              Attended: {classInfo.attendance.attended}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
