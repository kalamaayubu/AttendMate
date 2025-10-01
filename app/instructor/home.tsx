import StatsCard from "@/components/instructor/StatsCard";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

export default function Home() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const statsData = [
    {
      id: "1",
      title: "My Courses",
      value: 12,
      icon: "book-outline",
    },
    {
      id: "2",
      title: "Attendance",
      value: "85%",
      icon: "checkmark-done-outline",
    },
    {
      id: "3",
      title: "Assignments Completed",
      value: 9,
      icon: "document-text-outline",
    },
  ];

  // Sample data for charts with dual colors
  const lineChartData = {
    labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    datasets: [
      {
        data: [50, 75, 60, 90, 70, 95, 40, 66, 73, 50, 89, 51],
        color: () => "#16a34a", // green-600 stroke
        strokeWidth: 3,
      },
      {
        data: [30, 65, 40, 60, 50, 70, 50, 75, 60, 90, 70, 95],
        color: () => "#f97316", // orange-500 stroke
        strokeWidth: 3,
      },
      {
        data: [20, 45, 40, 70, 95, 60, 50, 70, 50, 75, 60, 90],
        color: () => "#3B82F6", // blue-500 stroke
        strokeWidth: 3,
      },
      {
        data: [60, 50, 70, 50, 75, 60, 90, 70, 95, 30, 45, 40],
        color: () => "#D946EF", // magenta-500 stroke
        strokeWidth: 3,
      },
    ],
  };

  const coursesAttendance = [
    {
      name: "Math 101",
      attendance: 85,
      color: "#D946EF", //magenta-600
      legendFontColor: "#D946EF",
      legendFontSize: 14,
    },
    {
      name: "History 201",
      attendance: 75,
      color: "rgba(249, 115, 22, 0.8)", // orange-500 @ 80% opacity
      legendFontColor: "rgba(249, 115, 22, 0.8)",
      legendFontSize: 14,
    },
    {
      name: "Physics 301",
      attendance: 65,
      color: "#22c55e", // green-500
      legendFontColor: "#166534",
      legendFontSize: 14,
    },
    {
      name: "Chemistry 101",
      attendance: 55,
      color: "#3B82F6", // blue-500
      legendFontColor: "#3B82F6",
      legendFontSize: 14,
    },
  ];

  const pieChartData = coursesAttendance.map(
    ({ name, attendance, color, legendFontColor, legendFontSize }) => ({
      name,
      population: attendance,
      color,
      legendFontColor,
      legendFontSize,
    })
  );

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="bg-white flex-1">
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 0, marginBottom: 0 }}
          stickyHeaderIndices={[0]}
        >
          {/* Header */}
          <View className="flex p-2 px-4 top-0 flex-row bg-white items-center justify-between">
            <Text className="font-semibold text-xl text-gray-700">
              Dashboard
            </Text>
            <View className="flex-row items-center gap-4">
              <TouchableOpacity
                onPress={() => setDropdownVisible(!dropdownVisible)}
              >
                <Ionicons name="ellipsis-vertical" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Stats*/}
          <View className="gap-4 px-4 py-3">
            {statsData.map(({ id, title, value, icon }) => (
              <StatsCard key={id} title={title} value={value} icon={icon} />
            ))}
          </View>

          {/* Graphs */}

          {/* 1. Line graph */}
          <View className="py-4 bg-green-50 rounded-xl mx-4 mb-6">
            <Text className="text-lg px-4 font-semibold text-green-700 mb-2">
              Attendance Over the Year
            </Text>
            <LineChart
              data={lineChartData}
              width={screenWidth - 24}
              height={220}
              chartConfig={{
                backgroundGradientFrom: "#ECFDF5", // green-50
                backgroundGradientTo: "#ECFDF5",
                color: (opacity = 1) => `rgba(22, 163, 74, ${opacity})`, // green-600 base color
                labelColor: () => "#4B5563", // gray-600 for labels
                strokeWidth: 1,
                propsForDots: {
                  r: "3",
                  strokeWidth: "1",
                },
              }}
              bezier
              style={{ borderRadius: 32 }}
            />
          </View>

          {/* 2. Pie chart */}
          <View className="px-4 py-4 bg-green-50 rounded-xl mx-4 mb-6">
            <Text className="text-lg font-semibold text-green-700 mb-2">
              Attendance Distribution
            </Text>
            <PieChart
              data={pieChartData}
              width={screenWidth - 64}
              height={180}
              chartConfig={{
                color: () => "#16a34a",
              }}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              absolute
            />
          </View>

          {/* Table Section */}
          <View className="px-4 py-4 bg-white rounded-xl mx-4 mb-6 shadow-sm border border-gray-200">
            <Text className="text-lg font-semibold text-gray-700 mb-3">
              Course Attendance Summary
            </Text>

            {/* Table Header */}
            <View className="flex-row border-b border-gray-200 pb-2 mb-2">
              <Text className="flex-1 font-semibold text-gray-600">Course</Text>
              <Text className="w-24 text-center font-semibold text-gray-600">
                Attendance
              </Text>
            </View>

            {/* Table Rows */}
            {coursesAttendance.map(({ name, attendance, color }) => (
              <View
                key={name}
                className="flex-row items-center justify-between py-2 border-b border-gray-100"
              >
                <View className="flex-row items-center flex-1">
                  <View
                    style={{ backgroundColor: color }}
                    className="w-3 h-3 rounded-full mr-2"
                  />
                  <Text className="text-gray-700">{name}</Text>
                </View>
                <Text className="w-24 text-center text-gray-800 font-medium">
                  {attendance}%
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* More horizontal */}
        {dropdownVisible && (
          <>
            {/* Transparent overlay to close dropdown on outside press */}
            <Pressable
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 10,
              }}
              onPress={() => setDropdownVisible(false)}
            />

            {/* Dropdown menu itself */}
            <View
              style={{
                position: "absolute",
                top: 40, // Adjust this to align with your header dropdown button
                right: 16,
                zIndex: 20,
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                elevation: 2,
                width: 150,
              }}
            >
              {/* Your dropdown options here */}
              <Pressable
                onPress={() => {
                  setDropdownVisible(false);
                  alert("Profile clicked");
                }}
                style={{
                  padding: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "#eee",
                }}
              >
                <Text>Profile</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setDropdownVisible(false);
                  alert("Settings clicked");
                }}
                style={{
                  padding: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "#eee",
                }}
              >
                <Text>Settings</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setDropdownVisible(false);
                  alert("Logout clicked");
                }}
                style={{ padding: 12 }}
              >
                <Text>Logout</Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
