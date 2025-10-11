import { AddCourseForm } from "@/types";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modal";

// Types for modal props
interface AddCourseModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  handleAddCourse: (data: AddCourseForm) => void;
}

export default function AddCourseModal({
  isModalVisible,
  setIsModalVisible,
  handleAddCourse,
}: AddCourseModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddCourseForm>({
    defaultValues: {
      course_name: "",
      course_code: "",
    },
  });

  const onSubmit = async (data: AddCourseForm) => {
    try {
      await handleAddCourse(data);
    } finally {
      reset(); // clear form after submission
    }
  };

  return (
    <>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        swipeDirection="down"
        onSwipeComplete={() => setIsModalVisible(false)}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View className="bg-white rounded-t-3xl overflow-hidden">
          <KeyboardAwareScrollView
            enableOnAndroid
            enableAutomaticScroll
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={Platform.OS === "ios" ? 40 : 100}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 20,
              paddingBottom: 40,
            }}
          >
            {/* --- Header --- */}
            <Text className="text-gray-800 text-lg font-semibold mb-1">
              Add New Course
            </Text>
            <Text className="text-gray-500 text-sm mb-5">
              Fill in the course details below to add it to the list.
            </Text>

            {/* --- Course Name --- */}
            <Text className="text-gray-500 text-sm mb-2">Course Name</Text>
            <Controller
              control={control}
              name="course_name"
              rules={{
                required: "Course name is required",
                minLength: {
                  value: 3,
                  message: "Course name must be at least 3 characters",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Enter course name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholderTextColor="#9CA3AF"
                  className={`border rounded-xl p-4 text-gray-800 mb-4 ${
                    errors.course_name
                      ? "border-red-400"
                      : "border-gray-300 focus:border-green-500"
                  }`}
                />
              )}
            />
            {errors.course_name && (
              <Text className="text-red-500 text-xs mb-3">
                {errors.course_name.message}
              </Text>
            )}

            {/* --- Course Code --- */}
            <Text className="text-gray-500 text-sm mb-2">Course Code</Text>
            <Controller
              control={control}
              name="course_code"
              rules={{
                required: "Course code is required",
                pattern: {
                  value: /^[A-Z]{3}\d{3}$/,
                  message: "Format example: CSC101",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Enter course code"
                  onBlur={onBlur}
                  onChangeText={(text) => onChange(text.toUpperCase())}
                  value={value}
                  autoCapitalize="characters"
                  placeholderTextColor="#9CA3AF"
                  className={`border rounded-xl p-4 text-gray-800 mb-1 ${
                    errors.course_code
                      ? "border-red-400"
                      : "border-gray-300 focus:border-green-500"
                  }`}
                />
              )}
            />
            {errors.course_code && (
              <Text className="text-red-500 text-xs mb-3">
                {errors.course_code.message}
              </Text>
            )}

            {/* --- Submit Button --- */}
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={isSubmitting}
              onPress={handleSubmit(onSubmit)}
              className={`bg-green-600 py-4 rounded-full items-center shadow-md mt-2 ${
                isSubmitting ? "opacity-80" : ""
              }`}
            >
              {isSubmitting ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size={18} color="#fff" />
                  <Text className="ml-3 text-white">Adding...</Text>
                </View>
              ) : (
                <Text className="text-white font-semibold text-base">
                  Add Course
                </Text>
              )}
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
    </>
  );
}
