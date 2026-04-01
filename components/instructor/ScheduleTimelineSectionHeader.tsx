import React from "react";
import { Text, View } from "react-native";

export default function ScheduleTimelineSectionHeader({
  title,
}: {
  title: string;
}) {
  return (
    <View className="bg-gray-50 px-4 py-3 border-y border-gray-100">
      <Text className="text-indigo-600 font-extrabold text-lg">{title}</Text>
    </View>
  );
}

