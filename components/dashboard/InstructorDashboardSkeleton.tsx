import { SkeletonBox } from "@/components/general/Skeleton";
import { Dimensions, ScrollView, Text, View } from "react-native";

const screenWidth = Dimensions.get("window").width;
const statW = (screenWidth - 48) / 3;
const chartW = screenWidth - 32;

export default function InstructorDashboardSkeleton() {
  return (
    <ScrollView contentContainerClassName="pb-10">
      <View className="flex-row flex-wrap justify-between px-4 mt-4">
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            className="bg-white rounded-lg shadow-md mb-4 items-center py-4"
            style={{ width: statW }}
          >
            <View className="rounded-full p-3 mb-2 bg-gray-100">
              <SkeletonBox width={24} height={24} borderRadius={6} />
            </View>
            <SkeletonBox width={48} height={22} />
            <SkeletonBox width={68} height={12} style={{ marginTop: 8 }} />
          </View>
        ))}
      </View>

      <View className="px-4 mt-2">
        <Text className="text-gray-700 font-bold mb-2">
          Attendance Over the Year
        </Text>
        <View className="bg-white rounded-xl p-2 shadow">
          <SkeletonBox width={chartW} height={220} borderRadius={12} />
        </View>
      </View>

      <View className="px-4 mt-4">
        <Text className="text-gray-700 font-bold mb-2">
          Attendance Distribution
        </Text>
        <View className="bg-white rounded-xl p-2 shadow items-center">
          <SkeletonBox width={chartW} height={200} borderRadius={12} />
        </View>
      </View>

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
          {[0, 1, 2, 3, 4].map((idx) => (
            <View
              key={idx}
              className={`flex-row px-3 py-2 items-center ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <View className="flex-1 pr-2">
                <SkeletonBox
                  width={Math.min(screenWidth * 0.45, 220)}
                  height={14}
                  borderRadius={6}
                />
              </View>
              <SkeletonBox width={40} height={14} borderRadius={6} />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
