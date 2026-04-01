import CustomHeader from "@/components/general/CustomHeader";
import CustomRefreshControl from "@/components/general/RefreshControl";
import { setReportData } from "@/redux/reportData";
import { RootState } from "@/redux/store";
import { coursesService } from "@/services/coursesService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isGeneratingReportData, setIsGeneratingReportData] = useState(false);

  const [courses, setCourses] = useState<any[]>([]);
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const dispatch = useDispatch();

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
    setIsGeneratingReportData(true);

    // Fetch the report data
    const res = await coursesService.getAttendanceReport(courseId);
    if (!res.success) {
      Toast.show({
        type: "error",
        text1: "Oops! something went wrong",
        text2: res.error,
      });
    }

    // Save report data to redux
    setIsGeneratingReportData(false);
    dispatch(setReportData({ courseId, data: res.data }));

    // Navigate to details screen
    router.push(`/instructor/reports/${courseId}`);
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
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          refreshControl={
            <CustomRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Top row: full-width primary metrics */}
          <View className="mt-4 rounded-2xl bg-indigo-600 p-5 shadow-sm">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white/80 text-xs font-semibold">
                  PRIMARY METRICS
                </Text>
                <Text className="text-white text-2xl font-extrabold mt-2">
                  Reports Overview
                </Text>
              </View>
              <View className="h-12 w-12 rounded-2xl bg-white/15 items-center justify-center">
                <Ionicons name="analytics-outline" size={22} color="white" />
              </View>
            </View>

            <View className="flex-row mt-6">
              <View className="flex-1">
                <Text className="text-white/80 text-xs font-semibold">
                  Courses
                </Text>
                <Text className="text-white text-3xl font-extrabold mt-1">
                  {courses.length}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-white/80 text-xs font-semibold">
                  Total Enrolled
                </Text>
                <Text className="text-white text-3xl font-extrabold mt-1">
                  {courses.reduce((sum: number, c: any) => sum + (c.students ?? 0), 0)}
                </Text>
              </View>
            </View>
          </View>

          {/* Middle row: 2-column bento tiles */}
          <View className="flex-row mt-4">
            <View
              className="flex-1 mr-2 rounded-2xl bg-white border border-gray-100 p-5 shadow-sm"
              style={{ elevation: 2 }}
            >
              <Text className="text-gray-500 text-xs font-semibold">
                AVG ENROLLED
              </Text>
              <Text className="text-gray-900 text-4xl font-extrabold mt-2 text-center">
                {courses.length > 0
                  ? Math.round(
                      courses.reduce((sum: number, c: any) => sum + (c.students ?? 0), 0) /
                        courses.length
                    )
                  : 0}
              </Text>
              <View className="mt-3 self-center px-3 py-1 rounded-full bg-green-500/15 border border-green-500/20">
                <Text className="text-green-700 text-xs font-extrabold">
                  Healthy
                </Text>
              </View>
            </View>

            <View
              className="flex-1 ml-2 rounded-2xl bg-white border border-gray-100 p-5 shadow-sm"
              style={{ elevation: 2 }}
            >
              <Text className="text-gray-500 text-xs font-semibold">
                READY TO GENERATE
              </Text>
              <Text className="text-gray-900 text-4xl font-extrabold mt-2 text-center">
                {courses.length}
              </Text>
              <View className="mt-3 self-center px-3 py-1 rounded-full bg-green-500/15 border border-green-500/20">
                <Text className="text-green-700 text-xs font-extrabold">
                  Good
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom row: Detailed Insights + course actions */}
          <View
            className="mt-4 rounded-2xl bg-gray-100 border border-gray-200 p-5"
            style={{ elevation: 1 }}
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-indigo-600 text-xs font-semibold">
                  DETAILED INSIGHTS
                </Text>
                <Text className="text-gray-900 text-xl font-extrabold mt-1">
                  Generate by Course
                </Text>
              </View>
              <Ionicons name="document-text-outline" size={20} color="#6366f1" />
            </View>

            <View className="mt-4">
              {courses.map((c: any) => {
                const isOpen = openItemId === c.id;
                return (
                  <View
                    key={c.id}
                    className="bg-white border border-gray-200 rounded-2xl p-4 mb-3"
                  >
                    <TouchableOpacity
                      onPress={() => setOpenItemId(isOpen ? null : c.id)}
                      className="flex-row items-center"
                    >
                      <View className="h-10 w-10 rounded-xl bg-indigo-500/10 items-center justify-center">
                        <Ionicons name="book-outline" size={18} color="#6366f1" />
                      </View>
                      <View className="flex-1 ml-3">
                        <Text className="text-indigo-600 font-extrabold">
                          {c.code}
                        </Text>
                        <Text className="text-gray-700 font-semibold">
                          {c.name}
                        </Text>
                        <Text className="text-gray-500 text-xs mt-1">
                          Enrolled: {c.students}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color="gray"
                        className={`${isOpen ? "rotate-90" : ""}`}
                      />
                    </TouchableOpacity>

                    {isOpen && (
                      <View className="mt-3">
                        <TouchableOpacity
                          onPress={() => handleGenerateReport(c.id)}
                          disabled={isGeneratingReportData}
                          className="bg-indigo-500/95 py-2 rounded-full"
                        >
                          <Text className="text-white text-center font-semibold">
                            {isGeneratingReportData ? "Generating..." : "Generate Report"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
