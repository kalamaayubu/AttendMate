import { SkeletonBox } from "@/components/general/Skeleton";
import { Dimensions, ScrollView, Text, View } from "react-native";

const screenWidth = Dimensions.get("window").width;
const statW = (screenWidth - 48) / 3;

export default function StudentDashboardSkeleton() {
  return (
    <ScrollView contentContainerClassName="pb-10">
      <View className="flex-row flex-wrap justify-between px-4 mt-4">
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            className="bg-white rounded-lg shadow-md mb-4 items-center py-4"
            style={{ width: statW }}
          >
            <SkeletonBox width={40} height={40} borderRadius={999} />
            <SkeletonBox width={52} height={22} style={{ marginTop: 10 }} />
            <SkeletonBox width={72} height={12} style={{ marginTop: 8 }} />
          </View>
        ))}
      </View>

      <View className="px-4 mt-2">
        <Text className="text-gray-700 font-bold mb-2">Attendance Trend</Text>
        <View className="bg-white rounded-xl p-2 shadow">
          <SkeletonBox
            width={screenWidth - 32}
            height={220}
            borderRadius={12}
          />
        </View>
      </View>

      <View className="px-4 mt-4">
        <Text className="text-gray-700 font-bold mb-2">
          Attendance by Course
        </Text>
        <View className="bg-white rounded-xl p-2 shadow items-center">
          <SkeletonBox
            width={screenWidth - 32}
            height={200}
            borderRadius={12}
          />
        </View>
      </View>

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
          {[0, 1, 2, 3].map((idx) => (
            <View
              key={idx}
              className={`flex-row px-3 py-2 items-center ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <View className="flex-1 pr-2">
                <SkeletonBox
                  width={Math.min(screenWidth * 0.38, 200)}
                  height={14}
                  borderRadius={6}
                />
              </View>
              <SkeletonBox width={36} height={14} borderRadius={6} />
              <SkeletonBox
                width={44}
                height={14}
                borderRadius={6}
                style={{ marginLeft: 12 }}
              />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
