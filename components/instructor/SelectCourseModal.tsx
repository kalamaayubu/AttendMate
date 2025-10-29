import { coursesService } from "@/services/coursesService";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const SelectCourseModal = ({
  onClose,
  onSelect,
  instructorId,
}: {
  onClose: () => void;
  onSelect: (course: any) => void;
  instructorId: string;
}) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  // Fetch available courses once modal mounts
  useEffect(() => {
    loadCourses();
  }, [instructorId]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const { success, data, error } =
        await coursesService.getAllCoursesExceptTaken(instructorId);

      if (!success) {
        setError(error || "Failed to load courses");
        setCourses([]);
      } else {
        setCourses(data);
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPress = async () => {
    const selectedCourse = courses.find((c) => c.id === selectedId);
    if (!selectedCourse) return;

    try {
      setAdding(true);
      await onSelect(selectedCourse); // wait for actual add to complete
    } catch (err) {
      console.error("Error adding course:", err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Pressable className="flex-1 bg-black/30 justify-end" onPress={onClose}>
      <Pressable
        className="bg-white rounded-t-3xl p-6 max-h-[70%]"
        onPress={(e) => e.stopPropagation()} // prevent background press from closing modal
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xl font-semibold text-gray-800">
            Select a Course
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text className="text-orange-500 font-medium bg-gray-600/5 p-[10px] rounded-full">
              <Ionicons name="close" size={20} />
            </Text>
          </TouchableOpacity>
        </View>

        {/* Loading & Error States */}
        {loading ? (
          <View className="py-10 items-center">
            <ActivityIndicator size="large" color="#6366f1" />
            <Text className="mt-2 text-gray-500">Loading courses...</Text>
          </View>
        ) : error ? (
          <View className="items-center">
            <Text className="text-red-500 font-medium mb-2">
              {error || "Something went wrong."}
            </Text>
            <TouchableOpacity
              onPress={loadCourses}
              className="px-4 py-4 mt-10 rounded-full w-full items-center bg-indigo-500"
            >
              <Text className="text-white font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : courses.length === 0 ? (
          <Text className="text-center text-gray-500 py-6">
            No available courses found.
          </Text>
        ) : (
          <>
            <Text className="text-gray-400 mb-6">
              Choose a course you will take students through.
            </Text>
            <FlatList
              data={courses}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                const isSelected = selectedId === item.id;
                return (
                  <TouchableOpacity
                    onPress={() => setSelectedId(item.id)}
                    className={`p-4 mb-3 border rounded-2xl ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-100"
                    }`}
                  >
                    <Text
                      className={`text-base font-semibold ${
                        isSelected ? "text-indigo-600" : "text-gray-800"
                      }`}
                    >
                      {item.code}
                    </Text>
                    <Text className="text-gray-500 text-sm">{item.name}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </>
        )}

        {/* Add button */}
        {loading ||
          (!error && (
            <TouchableOpacity
              disabled={!selectedId || adding}
              onPress={handleAddPress}
              className={`mt-4 py-3 rounded-full flex-row items-center justify-center ${
                selectedId && !adding ? "bg-indigo-500" : "bg-gray-300"
              }`}
            >
              {adding ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-center font-semibold text-base">
                  Add Course
                </Text>
              )}
            </TouchableOpacity>
          ))}
      </Pressable>
    </Pressable>
  );
};
