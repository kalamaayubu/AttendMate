import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type ScheduleTimelineItemProps = {
  item: any;
  isOpen: boolean;
  isLastInSection: boolean;
  onToggleOpen: () => void;
  onStartSession: (scheduleId: string) => void;
};

export default function ScheduleTimelineItem({
  item,
  isOpen,
  isLastInSection,
  onToggleOpen,
  onStartSession,
}: ScheduleTimelineItemProps) {
  const now = dayjs();
  const isActive =
    dayjs(item.start_time).isBefore(now) && dayjs(item.end_time).isAfter(now);

  return (
    <View className="flex-row px-4 py-2">
      {/* Timeline dot aligned to a global left line */}
      <View className="items-center" style={{ width: 22 }}>
        <View
          className="rounded-full"
          style={{
            width: 10,
            height: 10,
            backgroundColor: "#6366f1",
            marginTop: 14,
          }}
        />
        {!isLastInSection && (
          <View
            style={{
              position: "absolute",
              top: 26,
              bottom: 0,
              width: 1,
              backgroundColor: "rgba(99,102,241,0.2)",
            }}
          />
        )}
      </View>

      <View className="flex-1 ml-3">
        <View className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Orange left accent bar for active lessons */}
          <View
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 3,
              backgroundColor: isActive ? "#fb923c" : "transparent",
            }}
          />

          <View className="p-4">
          <View className="flex-row items-start">
            <View className="flex-1 pr-2">
              <Text className="text-indigo-600 font-extrabold text-base">
                {item.course?.course_code}
              </Text>
              <Text className="text-gray-700 font-semibold text-sm mt-1">
                {item.course?.course_name}
              </Text>

              <View className="flex-row items-center mt-3">
                <Ionicons name="time-outline" size={14} color="gray" />
                <Text className="text-gray-500 text-sm ml-2">
                  {`${dayjs(item.start_time).format("ddd, MMM D • h:mm A")} - ${dayjs(
                    item.end_time,
                  ).format("h:mm A")}`}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={onToggleOpen} hitSlop={10}>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="gray"
                className={`rounded-full p-2 ${isOpen ? "rotate-90" : ""}`}
              />
            </TouchableOpacity>
          </View>

          {isOpen && (
            <View className="mt-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-3">
              <View className="flex-row items-center mb-2">
                <Ionicons name="location-outline" size={16} color="gray" />
                <Text className="ml-2 text-gray-700">{item.venue}</Text>
              </View>

              <TouchableOpacity
                onPress={() => onStartSession(item.id)}
                className="bg-indigo-500/95 py-2 rounded-full"
              >
                <Text className="text-white text-center font-semibold">
                  Start session
                </Text>
              </TouchableOpacity>
            </View>
          )}
          </View>
        </View>
      </View>
    </View>
  );
}
