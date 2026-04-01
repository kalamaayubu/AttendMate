import AddCourseModal from "@/components/admin/AddCourseModal";
import CustomHeader from "@/components/general/CustomHeader";
import { coursesService } from "@/services/coursesService";
import { AddCourseForm } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function Courses() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState([
    {
      id: "1",
      name: "Introduction to Programming",
      code: "CS101",
      category: "CS",
    },
    {
      id: "2",
      name: "Data Structures & Algorithms",
      code: "CS202",
      category: "CS",
    },
    { id: "3", name: "Database Systems", code: "CS305", category: "CS" },
    { id: "4", name: "Machine Learning Basics", code: "AI410", category: "AI" },
    {
      id: "5",
      name: "Neural Networks & Deep Learning",
      code: "AI420",
      category: "AI",
    },
    { id: "6", name: "Discrete Mathematics", code: "MTH210", category: "Math" },
    { id: "7", name: "Linear Algebra", code: "MTH305", category: "Math" },
    {
      id: "8",
      name: "Human-Computer Interaction",
      code: "DES101",
      category: "Design",
    },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const filters = ["All", "CS", "AI", "Math", "Design"];

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory =
        selectedFilter === "All" || course.category === selectedFilter;
      const matchesSearch = course.name
        .toLowerCase()
        .trim()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedFilter, searchQuery, courses]);

  const handleAddCourse = async (data: AddCourseForm) => {
    const res = await coursesService.addCourse(data);

    if (!res.success) {
      Toast.show({
        type: "error",
        text1: "Error adding course",
        text2: res.message,
      });
      return;
    }

    setIsModalVisible(false);
    setCourses((prev) => [
      {
        id: `${Date.now()}`,
        name: data.course_name,
        code: data.course_code,
        category: "CS",
      },
      ...prev,
    ]);
    Toast.show({
      type: "success",
      text1: "Course added successfully!",
    });
  };

  return (
    <>
      <CustomHeader title="Courses" />

      <SafeAreaView className="flex-1" style={{ backgroundColor: "#F9FAFB" }}>
        {/* Header + search + filters */}
        <View className=" pb-4">
          <View className="bg-white border border-gray-100 rounded-2xl p-5 pt-0 shadow-sm">
            <View className="mt-4 flex-row items-center  border border-gray-200 rounded-2xl px-4 py-1">
              <Ionicons name="search" size={18} color="#6B7280" />
              <TextInput
                placeholder="Search courses..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 ml-3 text-gray-900 font-semibold"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  hitSlop={10}
                >
                  <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>

            {/* Filter chips (horizontal) */}
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={filters}
              keyExtractor={(item) => item}
              contentContainerStyle={{ paddingTop: 14 }}
              renderItem={({ item }) => {
                const isActive = selectedFilter === item;
                return (
                  <TouchableOpacity
                    onPress={() => setSelectedFilter(item)}
                    activeOpacity={0.85}
                    className={`mr-3 px-5 py-2 rounded-full border ${
                      isActive
                        ? "bg-indigo-600 border-indigo-600"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <Text
                      className={`text-sm font-extrabold ${
                        isActive ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>

        {/* Vertical list only */}
        <FlatList
          key="admin-courses-vertical"
          data={filteredCourses}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 140,
          }}
          ListEmptyComponent={() => (
            <View className="items-center justify-center mt-20">
              <Ionicons name="book-outline" size={48} color="#9CA3AF" />
              <Text className="text-gray-500 mt-3 text-base">
                No courses found
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.92}
              className="bg-white border border-gray-100 rounded-2xl p-5 mb-4 shadow-sm"
              style={{ elevation: 1 }}
              onPress={() => console.log(`Open course: ${item.name}`)}
            >
              <View className="flex-row items-center">
                {/* Image placeholder */}
                <View
                  className="rounded-2xl bg-indigo-500/10 border border-indigo-500/20"
                  style={{ width: 72, height: 56 }}
                />

                <View className="flex-1 ml-4">
                  <Text
                    className="text-indigo-700 text-lg font-extrabold"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text className="text-gray-600 font-semibold mt-1">
                    {item.code} • {item.category}
                  </Text>

                  <View className="flex-row items-center mt-3">
                    <Text className="text-gray-500 text-xs font-semibold">
                      Enrollments: —
                    </Text>
                    <View className="ml-3 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                      <Text className="text-green-700 text-xs font-extrabold">
                        Active
                      </Text>
                    </View>
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={18} color="#6B7280" />
              </View>
            </TouchableOpacity>
          )}
        />

        {/* --- Floating Add Button --- */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setIsModalVisible(true)}
          className="absolute right-6 bg-indigo-500/90 w-14 h-14 rounded-full items-center justify-center"
          style={{
            bottom: 106,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 4,
            elevation: 6,
          }}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>

        {/* --- Bottom Sheet Modal for Adding Course --- */}
        <AddCourseModal
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          handleAddCourse={handleAddCourse}
        />
      </SafeAreaView>
    </>
  );
}
