import React from "react";
import { Text, View } from "react-native";

export const CourseCard = ({ course }: { course: any }) => {
  return (
    <View className="bg-white border border-gray-100 rounded-2xl p-4 mb-4 shadow-sm">
      <Text className="text-lg font-semibold text-gray-800 mb-1">
        {course.code}
      </Text>
      <Text className="text-gray-500 mb-2">{course.name}</Text>
      <View className="flex-row justify-between items-center">
        <Text className="text-sm text-indigo-600 font-medium">
          {course.students} {course.students === 1 ? "student" : "students"}
        </Text>
        <Text className="text-xs text-gray-400">Enrolled</Text>
      </View>
    </View>
  );
};
