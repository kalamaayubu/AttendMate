import StatsCard from "@/components/instructor/StatsCard";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

export default function Home() {
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
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [50, 75, 60, 90, 70, 95],
        color: () => "#16a34a", // green-600 stroke
        strokeWidth: 3,
      },
      {
        data: [30, 45, 40, 60, 50, 70],
        color: () => "#f97316", // orange-500 stroke
        strokeWidth: 3,
      },
    ],
  };

  const coursesAttendance = [
    {
      name: "Math 101",
      attendance: 85,
      color: "#16a34a", // green-600
      legendFontColor: "#166534",
      legendFontSize: 14,
    },
    {
      name: "History 201",
      attendance: 75,
      color: "rgba(249, 115, 22, 0.8)", // orange-500 @ 80% opacity
      legendFontColor: "#c2410c",
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
      color: "rgba(249, 115, 22, 0.8)", // orange-500 @ 80% opacity
      legendFontColor: "#b45309",
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

  // const pieChartData = [
  //   {
  //     name: "Completed",
  //     population: 45,
  //     color: "#16a34a", // green-600
  //     legendFontColor: "#166534", // dark green-700 for legend text
  //     legendFontSize: 14,
  //   },
  //   {
  //     name: "Pending",
  //     population: 15,
  //     color: "rgba(249, 115, 22, 0.8)", // orange-500 at 80% opacity
  //     legendFontColor: "#f97316", // dark orange-700 for legend text
  //     legendFontSize: 14,
  //   },
  // ];

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="bg-white flex-1">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 0, marginBottom: 0 }}
        stickyHeaderIndices={[0]}
      >
        {/* Header */}
        <View className="flex p-4 px-3 top-0 flex-row bg-white items-center justify-between">
          <Text className="font-semibold text-xl text-gray-700">Dashboard</Text>
          <Ionicons name="ellipsis-vertical" size={16} color="black" />
        </View>

        {/* Quick Stats*/}
        <View className="gap-4 px-4 py-3">
          {statsData.map(({ id, title, value, icon }) => (
            <StatsCard key={id} title={title} value={value} icon={icon} />
          ))}
        </View>

        {/* Graphs */}

        {/* 1. Line graph */}
        <View className="px-4 py-4 bg-green-50 rounded-xl mx-4 mb-6">
          <Text className="text-lg font-semibold text-green-700 mb-2">
            Attendance Over Time
          </Text>
          <LineChart
            data={lineChartData}
            width={screenWidth - 64}
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
            style={{ borderRadius: 12 }}
          />
        </View>

        {/* 2. Pie chart */}
        <View className="px-4 py-4 bg-green-50 rounded-xl mx-4 mb-6">
          <Text className="text-lg font-semibold text-green-700 mb-2">
            Assignment Completion
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

        {/* Table */}
        <View></View>
      </ScrollView>
    </SafeAreaView>
  );
}
