import React from "react";
import { Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

type AdminGrowthLineChartCardProps = {
  title: string;
  labels: string[];
  dataPoints: number[];
};

export default function AdminGrowthLineChartCard({
  title,
  labels,
  dataPoints,
}: AdminGrowthLineChartCardProps) {
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = Math.max(220, Math.floor(screenWidth - 64));

  const safeLabels = Array.isArray(labels) && labels.length > 0 ? labels : ["—"];
  const safePoints =
    Array.isArray(dataPoints) && dataPoints.length > 0
      ? dataPoints.map((n) => (Number.isFinite(n) ? n : 0))
      : [0];

  return (
    <View className="bg-white rounded-2xl p-5 shadow-sm" style={{ elevation: 1 }}>
      <View className="flex-row items-center justify-between">
        <Text className="text-gray-900 font-extrabold text-base">{title}</Text>
        <View className="px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(99,102,241,0.10)" }}>
          <Text className="text-indigo-700 text-xs font-extrabold">Last 6 months</Text>
        </View>
      </View>

      <View className="mt-4">
        {safeLabels.length <= 1 && safePoints.every((n) => n === 0) ? (
          <View
            className="rounded-2xl border border-gray-200 bg-gray-50 items-center justify-center"
            style={{ height: 210 }}
          >
            <Text className="text-gray-600 font-semibold">
              No growth data yet
            </Text>
            <Text className="text-gray-500 text-xs mt-2">
              Enrollment activity will appear here.
            </Text>
          </View>
        ) : (
          <LineChart
            data={{
              labels: safeLabels,
              datasets: [
                {
                  data: safePoints,
                  strokeWidth: 3,
                  color: (opacity = 1) => `rgba(99,102,241,${opacity})`,
                },
              ],
            }}
            width={chartWidth}
            height={210}
            chartConfig={{
              backgroundGradientFrom: "#FFFFFF",
              backgroundGradientTo: "#FFFFFF",
              color: (opacity = 1) => `rgba(99,102,241,${opacity})`,
              labelColor: (opacity = 1) => `rgba(15,23,42,${opacity})`,
              propsForDots: { r: "3", strokeWidth: "0", stroke: "#6366f1" },
            }}
            bezier
            style={{ borderRadius: 16 }}
          />
        )}
      </View>
    </View>
  );
}

