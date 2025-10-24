import CustomHeader from "@/components/general/CustomHeader";
import { RootState } from "@/redux/store";
import { schedulesService } from "@/services/schedulesService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

// Date handling
import CustomRefreshControl from "@/components/general/RefreshControl";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(localizedFormat);

const tabs = ["All", "Today", "Upcoming"];

export default function Schedules() {
  const [activeTab, setActiveTab] = useState("All");
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const studentId = useSelector((state: RootState) => state.user.user?.id);

  // Helper to fetch schedules
  const fetchSchedules = useCallback(async () => {
    if (!studentId) return;
    setLoading(true);

    const res = await schedulesService.getSchedules(studentId);
    setLoading(false);

    if (!res.success) {
      Toast.show({
        type: "error",
        text1: "Error fetching schedules",
        text2: res.error,
      });
      return;
    }

    setSchedules(res.data ?? []);
  }, [studentId]);

  // Fetch schedules when component mounts
  useEffect(() => {
    fetchSchedules();
  }, [studentId]);

  // -- Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSchedules();
    setRefreshing(false);
  }, [fetchSchedules]);

  // Filter based on tab
  // const filteredData =
  //   activeTab === "All"
  //     ? scheduleData
  //     : scheduleData.filter((section) =>
  //         activeTab === "Today"
  //           ? section.title === "Today"
  //           : section.title !== "Today"
  //       );

  return (
    <>
      {/* <Stack.Screen options={{ headerShown: false }} /> */}

      <SafeAreaView edges={["left", "right"]} className="flex-1 bg-gray-50">
        {/* ===== Header ===== */}
        <CustomHeader title="Schedules" />

        {/* ===== Schedule List ===== */}
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#16a34a" />
            <Text className="text-gray-500 mt-2">Loading schedules...</Text>
          </View>
        ) : (
          <FlatList
            data={schedules}
            keyExtractor={(item) => item.scheduleId}
            contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 40 }}
            ListHeaderComponent={
              <View className="flex-row justify-start mb-8 px-4 bg-white shadow-sm py-3">
                {tabs.map((tab) => (
                  <Pressable
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-full ${
                      activeTab === tab ? "bg-green-600/80" : "bg-transparent"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        activeTab === tab ? "text-white" : "text-gray-600"
                      }`}
                    >
                      {tab}
                    </Text>
                  </Pressable>
                ))}
              </View>
            }
            refreshControl={
              <CustomRefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            renderItem={({ item }) => {
              const start = dayjs(item.startTime);
              const end = dayjs(item.endTime);
              const isTodayClass = start.isToday()
                ? "Today"
                : start.format("ddd, MMM D");

              return (
                <Pressable
                  onPress={() =>
                    router.push(`/student/schedules/${item.scheduleId}`)
                  }
                  className="bg-white rounded-2xl mx-6 shadow-sm p-4 mb-4 flex-row items-center"
                >
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: "#eef2ff" }}
                  >
                    <Ionicons name="book-outline" size={24} color="#6366f1" />
                  </View>

                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-800">
                      {item.courseCode}
                    </Text>

                    <Text className="text-sm text-gray-600">
                      {isTodayClass} • {start.format("h:mm A")} -{" "}
                      {end.format("h:mm A")}
                    </Text>

                    <Text className="text-xs text-gray-500">
                      Venue: {item.venue}
                    </Text>
                  </View>
                  <View>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color="#9ca3af"
                    />
                  </View>
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <Text className="text-center text-gray-500 mt-20">
                No schedules found.
              </Text>
            }
          />
        )}
      </SafeAreaView>
    </>
  );
}
