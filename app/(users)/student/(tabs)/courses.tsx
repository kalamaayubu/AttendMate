import CustomHeader from "@/components/general/CustomHeader";
import CustomRefreshControl from "@/components/general/RefreshControl";
import { RootState } from "@/redux/store";
import { coursesService } from "@/services/coursesService";
import { Course } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

export default function Courses() {
  const student = useSelector((state: RootState) => state.user.user);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [openEnrollModal, setOpenEnrollModal] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [loadingUnenrolled, setLoadingUnenrolled] = useState(false);
  const [unEnrolledCourses, setUnEnrolledCourses] = useState<Course[]>([]);
  const [enrolling, setEnrolling] = useState(false);

  // --- Fetch enrolled courses ---
  const fetchCourses = useCallback(async () => {
    if (!student?.id) return;
    setLoading(true);
    try {
      const res = await coursesService.getStudentEnrolledCourses(student.id);

      if (!res.success) {
        Toast.show({
          type: "error",
          text1: "Something went wrong",
          text2: res.error,
        });
        return;
      }

      setCourses(res.data ?? []);
    } catch (error) {
      console.error("Error loading enrolled courses:", error);
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        text2: "An unknown error occurred. Please try refreshing this page.",
      });
    } finally {
      setLoading(false);
    }
  }, [student?.id]);

  // --- Fetch unenrolled courses ---
  const fetchUnenrolledCourses = useCallback(async () => {
    setLoadingUnenrolled(true);
    try {
      const res = await coursesService.getStudentUnenrolledCourses(student?.id);
      if (!res.success) {
        Toast.show({
          type: "error",
          text1: "Something went wrong",
          text2: res.error,
        });
        return;
      }

      setUnEnrolledCourses(res.data ?? []);
    } catch (error) {
      console.error("Error loading unenrolled courses:", error);
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        text2: "An unknown error occurred. Please try again later.",
      });
    } finally {
      setLoadingUnenrolled(false);
    }
  }, [student?.id]);

  // --- Enroll to selected course(s) ---
  const handleEnrollment = async () => {
    if (!student?.id) return;
    setEnrolling(true);
    try {
      const res = await coursesService.enrollInCourse(
        student.id,
        selectedCourses
      );

      if (!res.success) {
        Toast.show({
          type: "error",
          text1: "Enrollment failed",
          text2: res.error,
        });
        return;
      }

      Toast.show({
        type: "success",
        text1: "Enrolled successfully",
        text2: `You have been enrolled to ${selectedCourses.length} course(s).`,
      });
    } catch (error) {
      console.error("Error during enrollment:", error);
      Toast.show({
        type: "error",
        text1: "Enrollment failed",
        text2: "An unknown error occurred. Please try again later.",
      });
    } finally {
      // Close modal and refresh courses
      setEnrolling(false);
      setOpenEnrollModal(false);
      setSelectedCourses([]);
      fetchCourses();
    }
  };

  // --- On mount ---
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // --- Pull to refresh ---
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCourses();
    setRefreshing(false);
  }, [fetchCourses]);

  // --- Render a course card ---
  const renderCourse = ({ item }: { item: Course }) => (
    <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm shadow-gray-300 flex-row items-center justify-between">
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <View className="px-3 py-1 bg-indigo-50 rounded-full mr-2">
            <Text
              numberOfLines={1}
              className="text-indigo-500 text-xs font-semibold tracking-wide"
            >
              {item.code}
            </Text>
          </View>
        </View>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="text-gray-800 text-base mb-1 font-medium"
        >
          {item.name}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
    </View>
  );

  // --- Empty state ---
  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center mt-20">
      <Ionicons name="book-outline" size={60} color="#9ca3af" />
      <Text className="text-gray-600 text-lg mt-3 font-medium">
        No enrolled courses
      </Text>
      <Text className="text-gray-500 text-sm mt-1 text-center px-10">
        Once you enroll in a course, it will appear here.
      </Text>
    </View>
  );

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-gray-100">
      <CustomHeader title="Courses" />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          renderItem={renderCourse}
          showsVerticalScrollIndicator={false}
          style={{ zIndex: 0 }}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 100,
          }}
          ListHeaderComponent={
            <View className="mb-6 p-5 rounded-xl">
              <View className="flex-row items-center gap-3 mb-2">
                <View className="bg-black p-2 rounded-xl">
                  <Ionicons name="library-outline" size={22} color="white" />
                </View>
                <Text className="text-2xl font-bold text-gray-800">
                  My enrolled courses
                </Text>
              </View>

              <Text className="text-gray-600 text-lg">
                To enroll to a new course, click the + button on the bottom
                right of the screen.
              </Text>
            </View>
          }
          refreshControl={
            <CustomRefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          ListEmptyComponent={renderEmpty}
        />
      )}

      {/* Open enrollemnt modal */}
      <Pressable
        style={{
          elevation: 10,
          overflow: Platform.OS === "android" ? "hidden" : "visible",
        }}
        className="bg-indigo-500/95 absolute bottom-2 w-16 h-16 self-end mr-6 items-center justify-center rounded-full"
        onPress={() => {
          setOpenEnrollModal(true);
          fetchUnenrolledCourses();
        }}
      >
        <Ionicons name="add" color={"white"} size={30} />
      </Pressable>

      {/* Course enrolment modal */}
      <Modal visible={openEnrollModal} transparent animationType="fade">
        <Pressable
          onPress={() => {
            setSelectedCourses([]);
            setOpenEnrollModal(false);
          }}
          className="flex-1 bg-black/30 justify-end"
        >
          {/* Stop taps inside the sheet from closing the modal */}
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="bg-white rounded-t-3xl pb-16 px-5 min-h-[30%] max-h-[80%]"
          >
            {/* Modal content goes here */}
            {/* Header */}
            <View className="items-center mb-4">
              <View className="w-20 h-2 mt-2 bg-gray-300 rounded-full mb-3" />
              <Text className="text-2xl font-bold text-gray-800">
                Choose Course
              </Text>
            </View>

            {loadingUnenrolled ? (
              <View className="flex-1 items-center justify-center my-10">
                <ActivityIndicator size="large" color="#6366f1" />
                <Text className="text-center">Loading courses</Text>
              </View>
            ) : unEnrolledCourses.length === 0 ? (
              <View className="flex-1 items-center justify-center my-10">
                <Ionicons name="book-outline" size={60} color="#9ca3af" />
                <Text className="text-gray-600 text-lg mt-3 font-medium">
                  No available courses
                </Text>
                <Text className="text-gray-500 text-sm mt-1 text-center px-10">
                  You are already enrolled in all available courses.
                </Text>
              </View>
            ) : (
              <ScrollView className="mb-6" showsVerticalScrollIndicator={false}>
                {unEnrolledCourses.map((course) => {
                  const isSelected = selectedCourses.includes(course.id);

                  return (
                    <Pressable
                      key={course.id}
                      onPress={() =>
                        setSelectedCourses((prev) => {
                          if (prev.includes(course.id)) {
                            // Deselect
                            return prev.filter((c) => c !== course.id);
                          }
                          // Select
                          return [...prev, course.id];
                        })
                      }
                      className={`p-4 rounded-xl mb-3 ${
                        isSelected
                          ? "bg-indigo-100 border border-indigo-400"
                          : "bg-gray-100"
                      }`}
                    >
                      <Text
                        className={`font-semibold ${
                          isSelected ? "text-indigo-700" : "text-indigo-600"
                        }`}
                      >
                        {course.code}
                      </Text>
                      <Text className="text-gray-800 text-base mt-1">
                        {course.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}

            {/* Enroll button */}
            {!loadingUnenrolled && (
              <Pressable
                disabled={selectedCourses.length === 0}
                className={`${
                  selectedCourses.length === 0
                    ? "bg-indigo-300"
                    : "bg-indigo-500"
                }  px-4 py-3 rounded-full items-center`}
                onPress={() => handleEnrollment()}
              >
                {enrolling ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-semibold text-lg">
                    Enroll
                  </Text>
                )}
              </Pressable>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
