import CustomHeader from "@/components/general/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

export default function InstructorDashboard() {
  const quickStats = [
    {
      id: "1",
      title: "My Courses",
      value: 12,
      icon: "book-outline",
      color: "#16a34a",
    },
    {
      id: "2",
      title: "Attendance",
      value: "85%",
      icon: "checkmark-done-outline",
      color: "#fb923c",
    },
    {
      id: "3",
      title: "Scheduled",
      value: 2,
      icon: "calendar-outline",
      color: "#6366f1",
    },
  ];

  const lineChartData = {
    labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    datasets: [
      {
        data: [50, 75, 60, 90, 70, 95, 40, 66, 73, 50, 89, 51],
        color: () => "#16a34a",
        strokeWidth: 3,
      },
      {
        data: [30, 65, 40, 60, 50, 70, 50, 75, 60, 90, 70, 95],
        color: () => "#f97316",
        strokeWidth: 3,
      },
      {
        data: [20, 45, 40, 70, 95, 60, 50, 70, 50, 75, 60, 90],
        color: () => "#3B82F6",
        strokeWidth: 3,
      },
      {
        data: [60, 50, 70, 50, 75, 60, 90, 70, 95, 30, 45, 40],
        color: () => "#D946EF",
        strokeWidth: 3,
      },
    ],
  };

  const coursesAttendance = [
    { name: "Math 101", attendance: 85, color: "#D946EF" },
    { name: "History 201", attendance: 75, color: "#f97316" },
    { name: "Physics 301", attendance: 65, color: "#22c55e" },
    { name: "Chemistry 101", attendance: 55, color: "#3B82F6" },
  ];

  const pieChartData = coursesAttendance.map((c) => ({
    name: c.name,
    population: c.attendance,
    color: c.color,
    legendFontColor: "#333",
    legendFontSize: 12,
  }));

  return (
    <SafeAreaView
      edges={["left", "right"]}
      className="flex-1 bg-gray-100 relative"
    >
      {/* ===== Header ===== */}
      <CustomHeader title="Dashboard" />

      <ScrollView contentContainerClassName="pb-10">
        {/* ===== Quick Stats ===== */}
        <View className="flex-row flex-wrap justify-between px-4 mt-4">
          {quickStats.map((item) => (
            <View
              key={item.id}
              className="bg-white rounded-lg shadow-md mb-4 items-center py-4"
              style={{ width: (screenWidth - 48) / 3 }}
            >
              <View
                className="rounded-full p-3 mb-2"
                style={{ backgroundColor: item.color + "20" }}
              >
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={item.color}
                />
              </View>
              <Text style={{ color: item.color }} className="text-lg font-bold">
                {item.value}
              </Text>
              <Text className="text-xs text-gray-600">{item.title}</Text>
            </View>
          ))}
        </View>

        {/* ===== Line Chart ===== */}
        <View className="px-4 mt-2">
          <Text className="text-gray-700 font-bold mb-2">
            Attendance Over the Year
          </Text>
          <View className="bg-white rounded-xl p-2 shadow">
            <LineChart
              data={lineChartData}
              width={screenWidth - 32}
              height={220}
              chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                color: (opacity = 1) => `rgba(22,163,74,${opacity})`,
                labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                propsForDots: { r: "4", strokeWidth: "0", stroke: "#16a34a" },
              }}
              bezier
              style={{ borderRadius: 12 }}
            />
          </View>
        </View>

        {/* ===== Pie Chart ===== */}
        <View className="px-4 mt-4">
          <Text className="text-gray-700 font-bold mb-2">
            Attendance Distribution
          </Text>
          <View className="bg-white rounded-xl p-2 shadow items-center">
            <PieChart
              data={pieChartData}
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
            Course Attendance Summary
          </Text>
          <View className="bg-white rounded-xl shadow overflow-hidden">
            <View className="flex-row bg-green-600/20 px-3 py-2">
              <Text className="flex-1 font-semibold text-gray-700">Course</Text>
              <Text className="w-24 text-center font-semibold text-gray-700">
                Attendance
              </Text>
            </View>
            {coursesAttendance.map((row, idx) => (
              <View
                key={row.name}
                className={`flex-row px-3 py-2 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <Text className="flex-1 text-gray-700">{row.name}</Text>
                <Text className="w-24 text-center text-gray-700">
                  {row.attendance}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
