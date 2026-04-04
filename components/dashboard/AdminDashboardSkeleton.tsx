import { SkeletonBox } from "@/components/general/Skeleton";
import { Dimensions, ScrollView, Text, View } from "react-native";

const screenWidth = Dimensions.get("window").width;
const pad = 20;
const innerW = screenWidth - pad * 2;
const statCardW = 120;
const statGap = 20;

export default function AdminDashboardSkeleton() {
  return (
    <ScrollView
      contentContainerStyle={{ paddingHorizontal: pad, paddingBottom: 140 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="">
        <Text className="text-gray-800 mt-2 text-xl font-semibold">
          System statistics overview with premium analytics.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-6 flex flex-row"
        contentContainerStyle={{ paddingRight: 8 }}
      >
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            className="bg-white flex flex-col rounded-xl p-5 border border-gray-100"
            style={{
              width: statCardW,
              marginRight: i < 3 ? statGap : 0,
              elevation: 1,
            }}
          >
            <SkeletonBox width={44} height={44} borderRadius={12} />
            <SkeletonBox width={72} height={12} style={{ marginTop: 16 }} />
            <SkeletonBox width={48} height={28} style={{ marginTop: 10 }} />
          </View>
        ))}
      </ScrollView>

      <View className="mt-6">
        <View
          className="bg-white rounded-2xl p-5 shadow-sm"
          style={{ elevation: 1 }}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-900 font-extrabold text-base">
              Growth Trend (Enrollments)
            </Text>
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: "rgba(99,102,241,0.10)" }}
            >
              <Text className="text-indigo-700 text-xs font-extrabold">
                Last 6 months
              </Text>
            </View>
          </View>
          <View className="mt-4">
            <SkeletonBox width={innerW - 40} height={210} borderRadius={16} />
          </View>
        </View>
      </View>

      <View className="mt-4">
        <View
          className="bg-white rounded-2xl p-5 shadow-sm"
          style={{ elevation: 1 }}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-900 font-extrabold text-base">
              Course Distribution
            </Text>
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: "rgba(249,115,22,0.10)" }}
            >
              <Text className="text-orange-700 text-xs font-extrabold">
                Top courses
              </Text>
            </View>
          </View>
          <View className="mt-4 items-center">
            <SkeletonBox width={innerW - 40} height={220} borderRadius={16} />
          </View>
        </View>
      </View>

      <View className="mt-6">
        <Text className="text-gray-900 font-extrabold text-xl">Top Courses</Text>
        <Text className="text-gray-600 mt-2">
          Highest enrollments in the last 12 months.
        </Text>

        <View className="mt-4">
        {[0, 1, 2].map((idx) => (
          <View
            key={idx}
            className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 shadow-sm"
            style={{ elevation: 1 }}
          >
            <View className="flex-row items-center">
              <SkeletonBox width={72} height={56} borderRadius={16} />
              <View className="flex-1 ml-4">
                <SkeletonBox width={120} height={18} borderRadius={6} />
                <SkeletonBox
                  width={innerW - 140}
                  height={16}
                  borderRadius={6}
                  style={{ marginTop: 8 }}
                />
                <View className="flex-row items-center mt-3">
                  <SkeletonBox width={88} height={28} borderRadius={999} />
                  <SkeletonBox
                    width={96}
                    height={28}
                    borderRadius={999}
                    style={{ marginLeft: 8 }}
                  />
                </View>
              </View>
            </View>
          </View>
        ))}
        </View>
      </View>
    </ScrollView>
  );
}
