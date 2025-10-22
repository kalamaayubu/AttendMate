import CustomHeader from "@/components/general/CustomHeader";
import { RootState } from "@/redux/store";
import { coursesService } from "@/services/coursesService";
import { Course } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

export default function Courses() {
  const student = useSelector((state: RootState) => state.user.user);
  const [myEnrolledCourses, setMyErolledCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch student's enrolled courses on mount
  useEffect(() => {
    const fetchStudentCourses = async () => {
      setIsLoading(true);
      if (!student?.id) return;
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

        setMyErolledCourses(res.data ?? []);
      } catch (error) {
        console.error("Error loading enrolled courses:", error);
        Toast.show({
          type: "error",
          text1: "Something went wrong",
          text2: "An unknown error occured. Please try refreshing this page",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentCourses();
  }, [student]);
  return (
    <SafeAreaView
      edges={["left", "right"]}
      className="flex-1 relative bg-gray-100"
    >
      {/* ===== Header ===== */}
      <CustomHeader title="Courses" />

      <View className="bg-green-100 mx-4 border rounded-2xl mb-6 mt-6 p-6 border-green-200">
        <Text className="text-xl mb-2 font-semibold">My enrolled courses</Text>
        <Text className="text-gray-600">
          To enroll to a new course, click the + button below.
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#16a34a" />
        </View>
      ) : (
        <FlatList
          data={myEnrolledCourses}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm shadow-gray-300 flex-row items-center justify-between">
              {/* Left side */}
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <View className="px-3 py-1 bg-indigo-50 rounded-full mr-2">
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      className="text-indigo-500 text-xs font-semibold tracking-wide"
                    >
                      {item.code}
                    </Text>
                  </View>
                </View>
                <Text className="text-gray-800 text-base mb-1 font-medium">
                  {item.name}
                </Text>
              </View>
              {/* Right side icon */}
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />{" "}
            </View>
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-20">
              <Ionicons name="book-outline" size={60} color="#9ca3af" />
              <Text className="text-gray-600 text-lg mt-3 font-medium">
                No enrolled courses
              </Text>
              <Text className="text-gray-500 text-sm mt-1 text-center px-10">
                Once you enroll in a course, it will appear here.
              </Text>
            </View>
          }
        />
      )}
      <Pressable
        style={{
          elevation: 10,
          overflow: Platform.OS === "android" ? "hidden" : "visible",
        }}
        className="bg-indigo-500/95 absolute bottom-2 w-16 h-16 self-center items-center justify-center rounded-full"
      >
        <Ionicons name="add" color={"white"} size={30} />
      </Pressable>
    </SafeAreaView>
  );
}
