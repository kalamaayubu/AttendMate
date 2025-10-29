import CustomHeader from "@/components/general/CustomHeader";
import CustomRefreshControl from "@/components/general/RefreshControl";
import { RootState } from "@/redux/store";
import { coursesService } from "@/services/coursesService";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
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

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  const instructor = useSelector((state: RootState) => state?.user.user);
  const instructorId = instructor?.id;

  // Helper to fetch instructor's courses
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    if (!instructorId) return; // wait until we have the user id

    const { success, data, error } = await coursesService.getInstructorCourses(
      instructorId
    );
    if (success) {
      setCourses(data);
    } else {
      console.error("Error loading instructor courses:", error);
    }
    setLoading(false);
  }, [instructorId]);

  useEffect(() => {
    fetchCourses();
  }, [instructorId, fetchCourses]);

  // Function to generate report
  const handleGenerateReport = async (courseId: string) => {
    // Fetch the report data
    const res = await coursesService.getAttendanceReport(courseId);
    if (!res.success) {
      Toast.show({
        type: "error",
        text1: "Oops! something went wrong",
        text2: res.error,
      });
    }

    // Navigate to report details page to display it
  };

  // Page refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCourses();
    setRefreshing(false);
  }, [fetchCourses]);

  return (
    <SafeAreaView edges={["left", "right"]} className="bg-gray-50 flex-1">
      {/* Header */}
      <CustomHeader title="Generate Report" />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#6366f1" size="large" />
          <Text className="text-gray-700 mt-2">Loading courses...</Text>
        </View>
      ) : (
        <FlatList
          data={courses}
          style={{ marginBottom: 0 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
          }}
          renderItem={({ item }) => (
            <View className=" items-center rounded-2xl bg-white p-4 mb-4 shadow-sm border border-gray-100">
              <View className="flex-row items-center">
                <View
                  className="rounded-xl p-3 mr-3"
                  style={{ backgroundColor: "#6366f1" + "20" }}
                >
                  <Ionicons name="book-outline" size={18} color={"#6366f1"} />
                </View>

                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold">
                    {item.code}
                  </Text>
                  <Text className="text-gray-700">{item.name}</Text>
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
                    <Ionicons name="people-outline" size={18} color="gray" />
                    <Text className="ml-1 text-gray-500">
                      Enrolled students: {item.students}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleGenerateReport(item.id)}
                    className="mt-2 bg-indigo-500/95 py-2 rounded-full"
                  >
                    <Text className="text-white text-center font-semibold">
                      Generate Report
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          ListHeaderComponent={
            <View className="mb-6 mt-4 p-5 rounded-xl">
              <View className="flex-row items-center gap-3 mb-2">
                <View className="bg-black p-2 rounded-xl">
                  <Ionicons name="document-outline" size={22} color="white" />
                </View>
                <Text className="text-2xl font-bold text-gray-800">
                  Want to generate report?
                </Text>
              </View>

              <Text className="text-gray-600 text-lg">
                {courses.length > 0
                  ? "Click the arrow on the course you want to generate report for."
                  : "You haven’t taken any courses yet. Tap the + button to get started."}
              </Text>
            </View>
          }
          refreshControl={
            <CustomRefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
