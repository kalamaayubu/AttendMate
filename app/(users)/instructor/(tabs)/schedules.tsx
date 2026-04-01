import CustomHeader from "@/components/general/CustomHeader";
import CustomRefreshControl from "@/components/general/RefreshControl";
import ScheduleTimelineItem from "@/components/instructor/ScheduleTimelineItem";
import ScheduleTimelineSectionHeader from "@/components/instructor/ScheduleTimelineSectionHeader";
import { RootState } from "@/redux/store";
import { schedulesService } from "@/services/schedulesService";
import { getCurrentLocation } from "@/utils/getLocation";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

export default function Schedules() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const instructor = useSelector((state: RootState) => state?.user.user); // Get instructor id
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null); // Chip selection

  // Derive unique courses from schedules
  const courses = useMemo(() => {
    const setObj = new Set(
      schedules.map((s) => s.course?.course_code).filter(Boolean),
    );
    return Array.from(setObj);
  }, [schedules]);

  // Filter schedules based on selected course
  const filteredSchedules = useMemo(() => {
    if (!selectedCourse) return schedules;
    return schedules.filter((s) => s.course?.course_code === selectedCourse);
  }, [schedules, selectedCourse]);

  const scheduleSections = useMemo(() => {
    const weekdayOrder = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    const map = new Map<string, any[]>();

    for (const s of filteredSchedules) {
      const dayName = dayjs(s.start_time).format("dddd"); // "Monday" etc
      const list = map.get(dayName) ?? [];
      list.push(s);
      map.set(dayName, list);
    }

    const sections = Array.from(map.entries()).map(([dayName, data]) => {
      // Keep the actual date inside the card; header is day name only.
      const sorted = [...data].sort(
        (a, b) => dayjs(a.start_time).valueOf() - dayjs(b.start_time).valueOf(),
      );
      return { key: dayName, title: dayName, data: sorted };
    });

    sections.sort(
      (a, b) => weekdayOrder.indexOf(a.key) - weekdayOrder.indexOf(b.key),
    );
    return sections;
  }, [filteredSchedules]);

  // Helper to fetch instructor schedules
  const fetchInstructorSchedules = useCallback(async () => {
    try {
      setLoading(true);
      if (!instructor?.id) return;

      const res = await schedulesService.getMySchedules(instructor?.id);

      if (!res?.success) {
        Toast.show({
          type: "error",
          text1: "An error occured",
          text2: res?.error,
        });
      }

      if (!res) return;
      // ensure we only pass an array to setSchedules
      const data = Array.isArray(res.data) ? res.data : [];
      setSchedules(data);
    } catch (error: any) {
      console.error(
        "Error occured fetching instructor schedules",
        error.message,
      );
      Toast.show({
        type: "error",
        text1: "An error occured",
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [instructor?.id]);

  // Fetch instructor's schedules
  useEffect(() => {
    fetchInstructorSchedules();
  }, [fetchInstructorSchedules]);

  // --- Pull to refresh ---
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchInstructorSchedules();
    setRefreshing(false);
  }, [fetchInstructorSchedules]);

  // Handle start session
  const handleStartSession = async (scheduleId: string) => {
    const coords = await getCurrentLocation();
    if (!coords) return;

    const { latitude, longitude } = coords;

    const res = await schedulesService.startSession(
      scheduleId,
      latitude,
      longitude,
    );

    if (res?.success) {
      Toast.show({
        type: "success",
        text1: "Session started",
        text2: "Location saved successfully.",
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: res?.error || "Could not start session.",
      });
    }
  };

  return (
    <SafeAreaView edges={["left", "right"]} className="bg-gray-50 flex-1">
      {/* Header */}
      <CustomHeader title="Schedules" />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#6366f1" size="large" />
          <Text className="text-gray-700 mt-2">Loading schedules...</Text>
        </View>
      ) : (
        <View className="flex-1">
          {/* Global far-left timeline line */}
          <View />

          <SectionList
            sections={scheduleSections}
            keyExtractor={(item) => item.id?.toString() ?? ""}
            stickySectionHeadersEnabled
            renderSectionHeader={({ section }) => (
              <ScheduleTimelineSectionHeader title={section.title} />
            )}
            renderItem={({ item, index, section }) => (
              <ScheduleTimelineItem
                item={item}
                isOpen={openItemId === item.id}
                isLastInSection={index === section.data.length - 1}
                onToggleOpen={() =>
                  setOpenItemId(openItemId === item.id ? null : item.id)
                }
                onStartSession={handleStartSession}
              />
            )}
            refreshControl={
              <CustomRefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 100,
            }}
            ListHeaderComponent={
              <View className="mb-6 mt-4 p-5 rounded-xl">
                <View className="flex-row items-center gap-3 mb-2">
                  <View className="bg-black p-2 rounded-xl">
                    <Ionicons name="time-outline" size={22} color="white" />
                  </View>
                  <Text className="text-2xl font-bold text-gray-800">
                    Manage your schedules
                  </Text>
                </View>

                <Text className="text-lg text-gray-800">
                  Tap the{" "}
                  <Text className="text-indigo-500 font-bold text-xl">＋</Text>{" "}
                  button on the bottom right to create a new class schedule
                </Text>

                {/* Filter strip */}
                {courses.length > 0 && (
                  <View className="mt-8 bg-red-600 rounded-2xl px-3 py-2">
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      {/* Optional "All" chip */}
                      <TouchableOpacity
                        onPress={() => setSelectedCourse(null)}
                        className={`px-6 py-2 mr-3 rounded-full border ${
                          selectedCourse === null
                            ? "bg-indigo-500 border-indigo-500"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        <Text
                          className={`${
                            selectedCourse === null
                              ? "text-white"
                              : "text-gray-700"
                          }`}
                        >
                          All
                        </Text>
                      </TouchableOpacity>

                      {courses.map((course) => {
                        const active = selectedCourse === course;
                        return (
                          <TouchableOpacity
                            key={course}
                            onPress={() => setSelectedCourse(course)}
                            className={`px-4 py-2 mr-3 rounded-full border ${
                              active
                                ? "bg-indigo-500 border-indigo-500"
                                : "bg-white border-gray-300"
                            }`}
                          >
                            <Text
                              className={`${
                                active ? "text-white" : "text-gray-700"
                              }`}
                            >
                              {course}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}
              </View>
            }
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-40">
                <Text className="text-gray-500">No schedules found.</Text>
              </View>
            }
          />
        </View>
      )}

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => router.push("/instructor/addSchedules")}
        activeOpacity={0.7}
        className="absolute items-center z-30 justify-center w-14 h-14 bg-indigo-500/90 shadow-2xl shadow-indigo-600 bottom-8 right-6 rounded-full"
      >
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
