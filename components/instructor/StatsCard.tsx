import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export default function StatsCard({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: string | number;
}) {
  return (
    <View className="flex-1 mx-2 rounded-xl bg-green-100 p-6 items-center">
      <View className="bg-green-600 rounded-full p-4 mb-4">
        <Ionicons name={icon} size={32} color="white" />
      </View>
      <Text className="text-2xl font-bold text-green-700">{value}</Text>
      <Text className="text-green-600 text-sm mt-1 font-semibold">{title}</Text>
    </View>
  );
}
