import CustomHeader from "@/components/general/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

const quickStats = [
  {
    id: "1",
    title: "Enrolled courses",
    value: 8,
    icon: "school-outline",
    color: "#fb923c",
  },
  {
    id: "2",
    title: "Attended",
    value: 48,
    icon: "checkmark-done-circle-outline",
    color: "#16a34a",
  },
  {
    id: "3",
    title: "Score",
    value: "83%",
    icon: "trophy-outline",
    color: "#6366f1",
  },
];

const attendanceTrend = {
  labels: ["Math", "Physics", "Chem", "Bio", "CS", "Lit"],
  datasets: [{ data: [90, 85, 92, 70, 88, 95], strokeWidth: 3 }],
};

const attendancePie = [
  { name: "Math", attendance: 90, color: "#3b82f6" },
  { name: "Physics", attendance: 85, color: "#16a34a" },
  { name: "Chem", attendance: 92, color: "#f59e0b" },
  { name: "Bio", attendance: 70, color: "#ef4444" },
  { name: "CS", attendance: 88, color: "#8b5cf6" },
  { name: "Lit", attendance: 95, color: "#14b8a6" },
];

const tableData = [
  { unit: "Math 101", total: 12, attended: 11 },
  { unit: "Physics 202", total: 10, attended: 9 },
  { unit: "Chem 103", total: 8, attended: 6 },
  { unit: "Bio 201", total: 9, attended: 7 },
];

export default function StudentDashboard() {
  return (
    <SafeAreaView
      edges={["left", "right"]}
      className="flex-1 bg-gray-100 relative"
    >
      {/* ===== Header ===== */}
      <CustomHeader title="Dashboard" />

      <ScrollView contentContainerClassName="pb-10">
        {/* ===== Stats ===== */}
        <View className="flex-row flex-wrap justify-between px-4 mt-4">
          {quickStats.map((item) => (
            <View
              key={item.id}
              className="bg-white rounded-lg shadow-md mb-4 items-center py-4"
              style={{ width: (screenWidth - 48) / 3 }}
            >
              <View
                className="rounded-full p-2 mb-2"
                style={{ backgroundColor: item.color + "20" }}
              >
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={item.color}
                />
              </View>
              <Text className="text-lg font-bold" style={{ color: item.color }}>
                {item.value}
              </Text>
              <Text className="text-xs text-gray-600">{item.title}</Text>
            </View>
          ))}
        </View>

        {/* ===== Line Chart ===== */}
        <View className="px-4 mt-2">
          <Text className="text-gray-700 font-bold mb-2">Attendance Trend</Text>
          <View className="bg-white rounded-xl p-2 shadow">
            <LineChart
              data={attendanceTrend}
              width={screenWidth - 32}
              height={220}
              yAxisSuffix="%"
              chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                color: (opacity = 1) => `rgba(99, 102, 241,${opacity})`,
                labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                propsForDots: { r: "5", strokeWidth: "0", stroke: "#3b82f6" },
              }}
              bezier
              style={{ borderRadius: 12 }}
            />
          </View>
        </View>

        {/* ===== Pie Chart ===== */}
        <View className="px-4 mt-4">
          <Text className="text-gray-700 font-bold mb-2">
            Attendance by Course
          </Text>
          <View className="bg-white rounded-xl p-2 shadow items-center">
            <PieChart
              data={attendancePie.map((p) => ({
                ...p,
                population: p.attendance,
                legendFontColor: "#333",
                legendFontSize: 12,
              }))}
              width={screenWidth - 32}
              height={200}
              chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </View>

        {/* ===== Table ===== */}
        <View className="px-4 mt-4">
          <Text className="text-gray-700 font-bold mb-2">
            Detailed Attendance
          </Text>
          <View className="bg-white rounded-xl shadow overflow-hidden">
            <View className="flex-row bg-green-600/20 px-3 py-2">
              <Text className="flex-1 font-semibold text-gray-700">Unit</Text>
              <Text className="w-16 text-center font-semibold text-gray-700">
                Total
              </Text>
              <Text className="w-20 text-center font-semibold text-gray-700">
                Attended
              </Text>
            </View>
            {tableData.map((row, idx) => (
              <View
                key={row.unit}
                className={`flex-row px-3 py-2 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <Text className="flex-1 text-gray-700">{row.unit}</Text>
                <Text className="w-16 text-center text-gray-700">
                  {row.total}
                </Text>
                <Text className="w-20 text-center text-gray-700">
                  {row.attended}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
