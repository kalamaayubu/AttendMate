import React from "react";
import { Text, View } from "react-native";

type TopCourseRow = {
  code: string;
  name: string;
  enrollments: number;
};

export default function AdminTopCoursesTable({
  title,
  rows,
}: {
  title: string;
  rows: TopCourseRow[];
}) {
  return (
    <View className="bg-white rounded-2xl p-5 shadow-sm" style={{ elevation: 1 }}>
      <Text className="text-gray-900 font-extrabold text-base">{title}</Text>

      <View className="mt-3 border border-gray-200 rounded-xl overflow-hidden">
        <View className="bg-indigo-50 px-4 py-2 flex-row items-center">
          <Text className="flex-1 text-gray-700 text-xs font-extrabold">Course</Text>
          <Text className="w-28 text-gray-700 text-xs font-extrabold text-right">
            Enrollments
          </Text>
        </View>
        {rows.map((r, idx) => (
          <View
            key={`${r.code}-${idx}`}
            className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
            style={{ paddingHorizontal: 16, paddingVertical: 12 }}
          >
            <View className="flex-row items-center">
              <View className="flex-1">
                <Text className="text-gray-900 font-extrabold">{r.code}</Text>
                <Text className="text-gray-500 text-xs mt-1" numberOfLines={1}>
                  {r.name}
                </Text>
              </View>
              <Text className="w-28 text-right text-gray-900 font-extrabold">
                {r.enrollments}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

