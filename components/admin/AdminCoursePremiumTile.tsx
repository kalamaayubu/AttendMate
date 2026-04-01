import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const categoryToTone = (category: string) => {
  if (category === "CS") return { label: "Active", bg: "rgba(34,197,94,0.14)", border: "rgba(34,197,94,0.30)", text: "#15803d" };
  if (category === "AI") return { label: "Active", bg: "rgba(79,70,229,0.14)", border: "rgba(79,70,229,0.30)", text: "#4f46e5" };
  if (category === "Math") return { label: "In Review", bg: "rgba(249,115,22,0.14)", border: "rgba(249,115,22,0.30)", text: "#c2410c" };
  if (category === "Design") return { label: "Planned", bg: "rgba(148,163,184,0.16)", border: "rgba(148,163,184,0.34)", text: "#334155" };
  return { label: "Status", bg: "rgba(148,163,184,0.16)", border: "rgba(148,163,184,0.34)", text: "#334155" };
};

const categoryToIcon = (category: string) => {
  if (category === "CS") return "school-outline";
  if (category === "AI") return "analytics-outline";
  if (category === "Math") return "calculator-outline";
  if (category === "Design") return "color-palette-outline";
  return "book-outline";
};

export default function AdminCoursePremiumTile({
  course,
  onPress,
}: {
  course: { id: string; name: string; code: string; category: string };
  onPress?: () => void;
}) {
  const tone = categoryToTone(course.category);
  const iconName = categoryToIcon(course.category);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
      style={{ elevation: 1 }}
    >
      {/* Top row: icon + status badge */}
      <View className="flex-row items-start justify-between">
        <View className="h-12 w-12 rounded-2xl bg-indigo-500/10 items-center justify-center">
          <Ionicons name={iconName as any} size={22} color="#4f46e5" />
        </View>

        <View
          className="px-3 py-1 rounded-full border"
          style={{ backgroundColor: tone.bg, borderColor: tone.border }}
        >
          <Text className="text-xs font-extrabold" style={{ color: tone.text }}>
            {tone.label}
          </Text>
        </View>
      </View>

      {/* Title hierarchy */}
      <Text className="mt-4 text-gray-900 text-lg font-extrabold">
        {course.name}
      </Text>
      <Text className="mt-1 text-gray-600 font-semibold">{course.code}</Text>

      {/* Category tag */}
      <View className="mt-3 flex-row items-center">
        <View
          className="px-3 py-1 rounded-full"
          style={{
            backgroundColor:
              course.category === "Math"
                ? "rgba(249,115,22,0.12)"
                : course.category === "Design"
                  ? "rgba(148,163,184,0.16)"
                  : "rgba(34,197,94,0.12)",
          }}
        >
          <Text className="text-xs font-extrabold" style={{ color: course.category === "Design" ? "#475569" : course.category === "Math" ? "#c2410c" : "#15803d" }}>
            {course.category}
          </Text>
        </View>
      </View>

      {/* Micro affordance (no progress bar) */}
      <View className="mt-4 flex-row items-center justify-between">
        <Text className="text-gray-500 text-xs font-semibold">
          Tap to manage
        </Text>
        <Ionicons name="chevron-forward" size={18} color="#6B7280" />
      </View>
    </TouchableOpacity>
  );
}

