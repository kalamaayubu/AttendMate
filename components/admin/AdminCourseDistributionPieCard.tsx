import React from "react";
import { Dimensions, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";

type PieItem = { name: string; population: number; color: string };

export default function AdminCourseDistributionPieCard({
  title,
  data,
}: {
  title: string;
  data: PieItem[];
}) {
  const screenWidth = Dimensions.get("window").width;
  const pieWidth = Math.max(220, screenWidth - 60);
  const safeData = Array.isArray(data) ? data.filter((d) => (d?.population ?? 0) > 0) : [];

  return (
    <View className="bg-white rounded-2xl p-5 shadow-sm" style={{ elevation: 1 }}>
      <View className="flex-row items-center justify-between">
        <Text className="text-gray-900 font-extrabold text-base">{title}</Text>
        <View className="px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(249,115,22,0.10)" }}>
          <Text className="text-orange-700 text-xs font-extrabold">Top courses</Text>
        </View>
      </View>

      <View className="mt-4 items-center">
        {safeData.length === 0 ? (
          <View
            className="rounded-2xl border border-gray-200 bg-gray-50 items-center justify-center"
            style={{ height: 220, width: pieWidth }}
          >
            <Text className="text-gray-600 font-semibold">
              No distribution data yet
            </Text>
            <Text className="text-gray-500 text-xs mt-2">
              Course enrollments will show here.
            </Text>
          </View>
        ) : (
          <PieChart
            data={safeData.map((d) => ({
              ...d,
              legendFontColor: "#6B7280",
              legendFontSize: 12,
            }))}
            width={pieWidth}
            height={220}
            chartConfig={{
              backgroundGradientFrom: "#FFFFFF",
              backgroundGradientTo: "#FFFFFF",
              color: (opacity = 1) => `rgba(15,23,42,${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        )}
      </View>
    </View>
  );
}

