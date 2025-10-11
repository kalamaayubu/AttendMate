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
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseCode, setNewCourseCode] = useState("");

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
      alert(res.message);
      return;
    }

    setIsModalVisible(false);
    alert(res.message);
  };

  return (
    <>
      <CustomHeader title="Courses" />

      <SafeAreaView className="flex-1 bg-white">
        {/* --- Page Description + Search & Filters --- */}
        <View className="px-6 pb-3 border-b border-gray-100 bg-white">
          <View className="mb-6 p-5 bg-green-50 rounded-2xl border border-green-100 shadow-sm">
            <View className="flex-row items-center gap-3 mb-1">
              <Ionicons name="library-outline" size={22} color="#16a34a" />
              <Text className="text-lg font-semibold text-gray-800">
                Manage Courses
              </Text>
            </View>
            <Text className="text-gray-600">
              Filter, search, or add new courses offered in your institution.
            </Text>
          </View>

          {/* --- Search Bar --- */}
          <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-1 mb-3">
            <Ionicons name="search" size={18} color="#6B7280" />
            <TextInput
              placeholder="Search courses..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-2 text-gray-800"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          {/* --- Filter Chips --- */}
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={filters}
            keyExtractor={(item) => item}
            contentContainerStyle={{ paddingVertical: 4 }}
            renderItem={({ item }) => {
              const isActive = selectedFilter === item;
              return (
                <TouchableOpacity
                  onPress={() => setSelectedFilter(item)}
                  activeOpacity={0.8}
                  className={`mr-3 px-8 py-2 rounded-full border ${
                    isActive
                      ? "bg-green-600 border-green-600"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
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

        {/* --- Courses List --- */}
        <FlatList
          data={filteredCourses}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
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
              activeOpacity={0.85}
              className="mb-4 bg-white border border-gray-100 rounded-2xl p-5 flex-row justify-between items-center shadow-[0_2px_6px_rgba(0,0,0,0.04)]"
              onPress={() => console.log(`Open course: ${item.name}`)}
            >
              <View className="flex-1 pr-4">
                <Text className="text-gray-800 font-semibold text-[16px] tracking-tight">
                  {item.name}
                </Text>
                <Text className="text-gray-500 text-[13px] mt-1 font-medium">
                  {item.code}
                </Text>
              </View>

              <View className="bg-green-50 rounded-full p-2">
                <Ionicons name="chevron-forward" size={18} color="#16a34a" />
              </View>
            </TouchableOpacity>
          )}
        />

        {/* --- Floating Add Button --- */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setIsModalVisible(true)}
          className="absolute bottom-8 right-6  bg-indigo-500/90 w-14 h-14 rounded-full items-center justify-center"
          style={{
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
