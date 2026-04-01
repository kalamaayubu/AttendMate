import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ReportsBentoCardProps = {
  item: any;
  index: number;
  isOpen: boolean;
  isGenerating: boolean;
  onToggleOpen: () => void;
  onGenerateReport: (courseId: string) => void;
};

function getBentoVariant(index: number, students: number) {
  if (students >= 20) return "large";
  if (index % 7 === 0) return "large";
  if (index % 5 === 0) return "tall";
  if (index % 4 === 0) return "small";
  return "medium";
}

export default function ReportsBentoCard({
  item,
  index,
  isOpen,
  isGenerating,
  onToggleOpen,
  onGenerateReport,
}: ReportsBentoCardProps) {
  const variant = getBentoVariant(index, item.students ?? 0);

  const minHeight =
    variant === "large"
      ? 240
      : variant === "tall"
        ? 220
        : variant === "small"
          ? 170
          : 200;

  return (
    <View
      style={{ minHeight }}
      className={`rounded-2xl border p-4 shadow-sm ${
        variant === "large" || variant === "tall"
          ? "bg-indigo-500/5 border-indigo-500/20"
          : variant === "small"
            ? "bg-white border-gray-100"
            : "bg-white border-gray-100"
      }`}
    >
      {/* Top row */}
      <View className="flex-row items-start justify-between">
        <TouchableOpacity onPress={onToggleOpen} hitSlop={12}>
          <View className="flex-row items-center">
            <View className="h-10 w-10 rounded-xl bg-black/5 items-center justify-center">
              <Ionicons name="document-outline" size={18} color="#6366f1" />
            </View>
            <View className="ml-3">
              <Text className="text-gray-900 font-extrabold text-base">
                {item.code}
              </Text>
              <Text className="text-gray-600 font-semibold text-sm mt-1">
                {item.name}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={onToggleOpen} hitSlop={12}>
          <Ionicons
            name="chevron-forward"
            size={18}
            color="gray"
            className={`mt-2 ${isOpen ? "rotate-90" : ""}`}
          />
        </TouchableOpacity>
      </View>

      {/* Metric */}
      <View className="mt-4">
        <View className="flex-row items-baseline justify-between">
          <Text className="text-gray-900 font-extrabold text-3xl">
            {item.students}
          </Text>
          <View className="flex-1 ml-3">
            <Text className="text-gray-500 text-xs font-semibold">
              Enrolled Students
            </Text>
            <Text className="text-gray-500 text-xs mt-1">
              Tap to expand and generate report
            </Text>
          </View>
        </View>
      </View>

      {/* Expanded Section */}
      {isOpen && (
        <View className="mt-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-3">
          <Text className="text-gray-700 font-bold mb-2">
            Report for this course
          </Text>
          <TouchableOpacity
            onPress={() => onGenerateReport(item.id)}
            disabled={isGenerating}
            className="bg-indigo-500/95 py-2 rounded-full"
          >
            <View className="flex-row items-center justify-center">
              {isGenerating ? (
                <>
                  <Ionicons name="time-outline" size={16} color="white" />
                  <Text className="text-white text-center font-semibold ml-2">
                    Generating
                  </Text>
                </>
              ) : (
                <Text className="text-white text-center font-semibold">
                  Generate Report
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

