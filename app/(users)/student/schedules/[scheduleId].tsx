import CustomHeader from "@/components/general/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ScheduleDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Demo data
  const classInfo = {
    course: "Math 101",
    time: "08:00 AM - 09:30 AM",
    date: "Today, 4th Oct",
    location: "Room A2",
    instructor: "Prof. Kimani",
    color: "#3b82f6",
    description:
      "Ensure to put on your lab court. This class covers algebraic functions and their applications in physics. You will learn algebraic manipulations, solving equations, and applying formulas in real-life problems.",
    attendance: { total: 12, attended: 10 },
    type: "Lecture",
    credits: 3,
  };

  const [openDescription, setOpenDescription] = useState(true);

  const attendancePercent =
    (classInfo.attendance.attended / classInfo.attendance.total) * 100;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView className="flex-1 bg-gray-50">
        <CustomHeader title={`${classInfo.course}`} />
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          {/* ===== Header Card with Gradient ===== */}
          <View
            className="rounded-2xl shadow-gray-600 shadow-2xl mb-4"
            style={{
              overflow: "hidden",
              borderLeftWidth: 5,
              borderLeftColor: "#6366f1",
            }}
          >
            <LinearGradient
              colors={["#3b82f6", "#6366f1"]} // blue -> indigo gradient
              start={[0, 0]}
              end={[1, 1]}
              className="p-5 gap-3"
            >
              {/* Content inside */}
              <Text className="text-2xl font-bold text-gray-50 mb-1">
                {classInfo.course}
              </Text>
              <Text className="text-sm text-gray-100">{classInfo.date}</Text>
              <Text className="text-sm text-gray-100">{classInfo.time}</Text>

              <View className="flex-row items-center mt-2">
                <Ionicons name="location-outline" size={16} color="#fff" />
                <Text className="ml-1 text-sm text-white">
                  {classInfo.location}
                </Text>
              </View>

              <View className="flex-row items-center mt-1">
                <Ionicons name="person-outline" size={16} color="#fff" />
                <Text className="ml-1 text-sm text-white">
                  {classInfo.instructor}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* ===== Attendance Progress Bar ===== */}
          <View className="bg-white rounded-2xl shadow p-4 mb-4">
            <Text className="text-base font-semibold text-gray-800 mb-2">
              Attendance
            </Text>
            <Text className="text-sm text-gray-600">
              Total Sessions: {classInfo.attendance.total}
            </Text>
            <Text className="text-sm text-gray-600">
              Attended: {classInfo.attendance.attended}
            </Text>
            <View className="bg-gray-200 h-2 rounded-full mt-2">
              <View
                className="h-2 rounded-full bg-green-500"
                style={{ width: `${attendancePercent}%` }}
              />
            </View>
          </View>

          {/* ===== Description (collapsible) ===== */}
          <View className="bg-white rounded-2xl shadow p-4 mb-4">
            <TouchableOpacity
              className="flex-row justify-between items-center"
              onPress={() => setOpenDescription(!openDescription)}
            >
              <Text className="text-base font-semibold text-gray-800">
                About this class
              </Text>
              <Ionicons
                name={
                  openDescription
                    ? "chevron-up-outline"
                    : "chevron-down-outline"
                }
                size={20}
                color="#888"
              />
            </TouchableOpacity>
            {openDescription && (
              <Text className="text-sm text-gray-600 leading-5 mt-2">
                {classInfo.description}
              </Text>
            )}
          </View>
        </ScrollView>

        {/* ===== Floating Action Button ===== */}
        <Pressable
          className="absolute bottom-16 right-6 bg-green-600/80 w-16 h-16 rounded-full items-center justify-center shadow-lg"
          onPress={() => alert("Add to Calendar / Mark Attendance")}
        >
          <Ionicons name="calendar-outline" size={28} color="white" />
        </Pressable>
      </SafeAreaView>
    </>
  );
}
