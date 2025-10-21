import CustomHeader from "@/components/general/CustomHeader";
import { RootState } from "@/redux/store";
import { schedulesService } from "@/services/schedulesService";
import { getCurrentLocation } from "@/utils/getLocation";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
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
  const instructor = useSelector((state: RootState) => state?.user.user); // Get instructor id
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  // Fetch instructor's schedules
  useEffect(() => {
    if (!instructor?.id) return;

    const fetchInstructorSchedules = async () => {
      try {
        setLoading(true);
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
        console.log("DATA:::", data);
        setSchedules(data);
      } catch (error: any) {
        console.error(
          "Error occured fetching instructor schedules",
          error.message
        );
        Toast.show({
          type: "error",
          text1: "An error occured",
          text2: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorSchedules();
  }, [instructor?.id]);

  // Handle start session
  const handleStartSession = async (scheduleId: string) => {
    const coords = await getCurrentLocation();
    if (!coords) return;

    const { latitude, longitude } = coords;

    const res = await schedulesService.startSession(
      scheduleId,
      latitude,
      longitude
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

      {/* Page heading and descriptions */}
      <View className="pb-0">
        <View className="mb-6 p-5 m-5 bg-green-50 rounded-2xl border border-green-100 shadow-sm">
          <View className="flex-row items-center gap-3 mb-1">
            <View className="bg-green-100 p-2 rounded-xl">
              <Ionicons name="calendar-outline" size={22} color="#16a34a" />
            </View>
            <Text className="text-lg font-semibold text-gray-800">
              Manage your schedules
            </Text>
          </View>
          <Text className="text-gray-600 leading-relaxed">
            Tap the <Text className="text-green-600 font-bold text-xl">＋</Text>{" "}
            button on the bottom right to create a new class schedule.
          </Text>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#16a34a" size="large" />
          <Text className="text-gray-700 mt-2">Loading schedules...</Text>
        </View>
      ) : (
        <FlatList
          data={schedules}
          keyExtractor={(item) =>
            item.id?.toString() || Math.random().toString()
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100,
            paddingHorizontal: 20,
          }}
          renderItem={({ item }) => (
            // Schedule
            <View
              className=" items-center rounded-2xl bg-white p-4 mb-3 shadow-sm border border-gray-100"
              style={{
                elevation: 2,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
              }}
            >
              <View className="flex-row items-center">
                <View
                  className="rounded-full p-3 mr-3"
                  style={{ backgroundColor: "#16a34a" + "20" }}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={"#16a34a"}
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold">
                    {item.course?.course_code}
                  </Text>
                  <Text className="text-gray-700">
                    {item.course?.course_name}
                  </Text>
                  <Text className="text-gray-500 text-sm mt-1">
                    {`${dayjs(item.start_time).format(
                      "ddd, MMM D • h:mm A"
                    )} - ${dayjs(item.end_time).format("h:mm A")}`}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    setOpenItemId(openItemId === item.id ? null : item.id)
                  }
                >
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={"gray"}
                    className={`rounded-full p-2 ${
                      openItemId === item.id ? "rotate-90" : ""
                    }`}
                  />
                </TouchableOpacity>
              </View>

              {/* Expanded Section */}
              {openItemId === item.id && (
                <View className="mt-2 w-full border-t border-gray-100">
                  <View className="flex-row items-center mt-2 mb-2">
                    <Ionicons name="location-outline" size={16} color="gray" />
                    <Text className="ml-1 text-gray-700">{item.venue}</Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleStartSession(item.id)}
                    className="mt-2 bg-indigo-500/95 py-2 rounded-full"
                  >
                    <Text className="text-white text-center font-semibold">
                      Start session
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-40">
              <Text className="text-gray-500">No schedules found.</Text>
            </View>
          }
        />
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
