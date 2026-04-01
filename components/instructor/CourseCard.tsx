import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export const CourseCard = ({
  course,
  stackIndex = 0,
}: {
  course: any;
  stackIndex?: number;
}) => {
  const students = Number(course?.students ?? 0);
  const tag =
    students >= 30 ? { label: "High Demand", tone: "orange" } : { label: "Standard", tone: "green" };

  return (
    <View className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-4">
      <View className="flex-row items-start justify-between">
        {/* Large illustrative icon placeholder */}
        <View className="h-14 w-14 rounded-2xl bg-indigo-500/10 items-center justify-center">
          <Ionicons name="school-outline" size={26} color="#6366f1" />
        </View>

        {/* Category tag */}
        <View
          className={`px-3 py-1 rounded-full ${
            tag.tone === "orange"
              ? "bg-orange-500/15 border border-orange-500/20"
              : "bg-green-500/15 border border-green-500/20"
          }`}
        >
          <Text
            className={`text-xs font-extrabold ${
              tag.tone === "orange" ? "text-orange-700" : "text-green-700"
            }`}
          >
            {tag.label}
          </Text>
        </View>
      </View>

      <Text className="text-indigo-600 text-xl font-extrabold mt-4">
        {course.code}
      </Text>
      <Text className="text-gray-700 font-semibold mt-2">{course.name}</Text>

      <View className="flex-row items-center justify-between mt-4">
        <View className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
          <Text className="text-gray-600 text-xs font-semibold">
            Enrolled: {students}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={18} color="gray" />
      </View>
    </View>
  );
};
