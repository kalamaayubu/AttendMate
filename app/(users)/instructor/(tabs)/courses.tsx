import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomHeader from "@/components/general/CustomHeader";
import CustomRefreshControl from "@/components/general/RefreshControl";
import { CourseCard } from "@/components/instructor/CourseCard";
import { SelectCourseModal } from "@/components/instructor/SelectCourseModal";
import { RootState } from "@/redux/store";
import { coursesService } from "@/services/coursesService"; // ✅ import service
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

export const CoursesScreen = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Get the user id from the store
  const user = useSelector((state: RootState) => state.user.user);
  const instructorId = user?.id;

  // Helper to fetch courses
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

  // --- Pull to refresh ---
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCourses();
    setRefreshing(false);
  }, [fetchCourses]);

  // Function to add course to an instructor
  const handleAddCourse = async (course: any) => {
    if (!instructorId) return;

    const { success, error } = await coursesService.addInstructorCourse(
      instructorId,
      course.id
    );

    if (!success) {
      Toast.show({
        type: "error",
        text1: "Error occurred",
        text2: "Failed to add course. Please try again.",
      });
      console.error("Failed to add course:", error);
      return;
    }

    // Optimistic update
    setCourses((prev) => [...prev, course]);
    Toast.show({
      type: "success",
      text1: "Course added successfully!",
    });
    setModalVisible(false);
  };

  return (
    <>
      <SafeAreaView edges={["left", "right"]} className="flex-1 bg-white">
        <CustomHeader title="Courses" />
        {/* Loading State */}
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#6366f1" />
            <Text className="text-gray-500 mt-3">Loading courses...</Text>
          </View>
        ) : courses.length > 0 ? (
          <FlatList
            data={courses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CourseCard course={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
            }}
            refreshControl={
              <CustomRefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            ListHeaderComponent={
              <View className="mb-6 mt-4 p-5 rounded-xl">
                <View className="flex-row items-center gap-3 mb-2">
                  <View className="bg-black p-2 rounded-xl">
                    <Ionicons name="library-outline" size={22} color="white" />
                  </View>
                  <Text className="text-2xl font-bold text-gray-800">
                    Your Courses
                  </Text>
                </View>

                <Text className="text-gray-600 text-lg">
                  {courses.length > 0
                    ? "You’re currently taking students through the following courses."
                    : "You haven’t taken any courses yet. Tap the + button to get started."}
                </Text>
              </View>
            }
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-400 text-lg">No courses yet</Text>
            <Text className="text-gray-500 mt-1">
              Tap the + button to get started
            </Text>
          </View>
        )}

        {/* Floating Add Button */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="absolute items-center z-30 justify-center w-14 h-14 bg-indigo-500/90 shadow-2xl bottom-8 right-6 rounded-full"
        >
          <Ionicons name="add" size={26} color="#fff" />
        </TouchableOpacity>

        {/* Modal for selecting new courses */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <SelectCourseModal
            instructorId={user?.id ?? ""}
            onClose={() => setModalVisible(false)}
            onSelect={handleAddCourse}
          />
        </Modal>
      </SafeAreaView>
    </>
  );
};

export default CoursesScreen;
