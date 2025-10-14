import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
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
import { CourseCard } from "@/components/instructor/CourseCard";
import { SelectCourseModal } from "@/components/instructor/SelectCourseModal";
import { RootState } from "@/redux/store";
import { coursesService } from "@/services/coursesService"; // ✅ import service
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

export const CoursesScreen = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Get the user id from the store
  const user = useSelector((state: RootState) => state.user.user);
  const instructorId = user?.id;

  useEffect(() => {
    if (!instructorId) return; // wait until we have the user id

    const fetchCourses = async () => {
      setLoading(true);
      const { success, data, error } =
        await coursesService.getInstructorCourses(instructorId);
      if (success) {
        setCourses(data);
      } else {
        console.error("Error loading instructor courses:", error);
      }
      setLoading(false);
    };

    fetchCourses();
  }, [instructorId]);

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
      <CustomHeader title="Courses" />
      <SafeAreaView className="flex-1 bg-white">
        {/* Heading information */}
        <View className="mb-6 mx-4 p-5 bg-green-50 rounded-2xl border border-green-100 shadow-sm">
          <View className="flex-row items-center gap-3 mb-2">
            <View className="bg-green-100 p-2 rounded-xl">
              <Ionicons name="library-outline" size={22} color="#16a34a" />
            </View>
            <Text className="text-lg font-semibold text-gray-800">
              Your Courses
            </Text>
          </View>

          <Text className="text-gray-600 leading-relaxed">
            {courses.length > 0
              ? "You’re currently taking students through the following courses."
              : "You haven’t taken any courses yet. Tap the + button to get started."}
          </Text>
        </View>

        {/* Loading State */}
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#16a34a" />
            <Text className="text-gray-500 mt-3">Loading courses...</Text>
          </View>
        ) : courses.length > 0 ? (
          <FlatList
            data={courses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CourseCard course={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 16 }}
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
