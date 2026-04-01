import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AdminCoursesSearchBar({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (text: string) => void;
}) {
  return (
    <View className="bg-black rounded-2xl border border-gray-100 px-4 py-3 shadow-sm">
      <View className="flex-row items-center">
        <Ionicons name="search" size={18} color="#6B7280" />
        <TextInput
          placeholder="Search courses..."
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          className="flex-1 ml-3 text-gray-900 font-semibold"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText("")} hitSlop={10}>
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
      {value.length > 0 && (
        <Text className="text-gray-500 text-xs mt-2">
          Showing results for “{value.trim()}”
        </Text>
      )}
    </View>
  );
}
