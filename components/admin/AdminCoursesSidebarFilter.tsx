import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AdminCoursesSidebarFilter({
  filters,
  selectedFilter,
  onSelectFilter,
}: {
  filters: string[];
  selectedFilter: string;
  onSelectFilter: (value: string) => void;
}) {
  return (
    <View className="bg-white rounded-2xl border border-gray-100 p-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <View className="h-10 w-10 rounded-xl bg-indigo-500/10 items-center justify-center">
            <Ionicons name="options-outline" size={18} color="#4f46e5" />
          </View>
          <Text className="ml-3 text-gray-900 font-extrabold">Filters</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filters.map((f) => {
          const active = selectedFilter === f;
          return (
            <TouchableOpacity
              key={f}
              onPress={() => onSelectFilter(f)}
              activeOpacity={0.85}
              className={`mb-3 rounded-xl border px-4 py-3 ${
                active
                  ? "bg-indigo-500/10 border-indigo-500/30"
                  : "bg-white border-gray-200"
              }`}
            >
              <Text
                className={`text-sm font-extrabold ${
                  active ? "text-indigo-700" : "text-gray-700"
                }`}
              >
                {f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

