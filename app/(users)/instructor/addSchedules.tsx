import CustomHeader from "@/components/general/CustomHeader";
import DateTimeField from "@/components/general/DateTimeField";
import { ScheduleForm } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Stack } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const courses = [
  "Yoga",
  "Pilates",
  "Zumba",
  "Spin Class",
  "Meditation",
  "Crossfit",
];

export default function AddSchedule() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleForm>({
    defaultValues: {
      course: "",
      startTime: null,
      endTime: null,
      venue: "",
      instructions: "",
    },
  });

  const onSubmit = (data: ScheduleForm) => {
    if (!data.startTime || !data.endTime) {
      alert("Please select both start and end times");
      return;
    }

    if (data.endTime <= data.startTime) {
      alert("End time must be after start time");
      return;
    }

    const newSchedule = {
      ...data,
      startTime: data.startTime.toISOString(),
      endTime: data.endTime.toISOString(),
    };

    console.log("✅ New Schedule:", newSchedule);
    alert("Schedule added successfully!");
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Add Schedule",
          headerTintColor: "#374151",
          headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
        }}
      />

      <CustomHeader title="Schedule a Class" backButton />

      {/* 🧩 Wrap ScrollView inside KeyboardAvoidingView */}
      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: 0, flexGrow: 1 }}
        extraScrollHeight={0}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
      >
        <ScrollView
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 20,
            flexGrow: 1,
          }}
        >
          {/* --- Info Header --- */}
          <View className="mb-6 p-5 bg-green-50 rounded-2xl border border-green-100 shadow-sm">
            <View className="flex-row items-center gap-3 mb-1">
              <Ionicons name="calendar-outline" size={22} color="#16a34a" />
              <Text className="text-lg font-semibold text-gray-800">
                Create New Schedule
              </Text>
            </View>
            <Text className="text-gray-600">
              Fill in the course details, venue, and timings below.
            </Text>
          </View>

          {/* --- Course Picker --- */}
          <Text className="mb-1 font-semibold text-gray-700">Course</Text>
          <View className="overflow-hidden mb-5 rounded-xl border border-gray-300 bg-gray-50">
            <Controller
              control={control}
              name="course"
              rules={{ required: "Please select a course" }}
              render={({ field: { onChange, value } }) => (
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  mode="dropdown"
                  dropdownIconColor="#16a34a"
                  style={{
                    color: "#374151",
                    backgroundColor: "#f9fafb",
                    height: 50,
                  }}
                >
                  <Picker.Item
                    label="Select a course"
                    value=""
                    color="#9CA3AF"
                  />
                  {courses.map((course) => (
                    <Picker.Item key={course} label={course} value={course} />
                  ))}
                </Picker>
              )}
            />
          </View>
          {errors.course && (
            <Text className="text-red-500 text-sm -translate-y-4 mb-4">
              {errors.course.message}
            </Text>
          )}

          {/* --- Start & End Time --- */}
          <DateTimeField
            control={control}
            name="startTime"
            label="Start Time"
          />
          <DateTimeField
            control={control}
            name="endTime"
            label="End Time"
            timeOnly
          />

          {/* --- Venue --- */}
          <Text className="mb-1 font-semibold text-gray-700">Venue</Text>
          <Controller
            control={control}
            name="venue"
            rules={{ required: "Venue is required" }}
            render={({ field: { value, onChange } }) => (
              <TextInput
                placeholder="Enter venue"
                value={value}
                onChangeText={onChange}
                selectionColor={"black"}
                placeholderTextColor="#9CA3AF" // gray-400
                className="mb-1 rounded-xl border border-gray-300 bg-gray-50 p-4"
              />
            )}
          />
          {errors.venue && (
            <Text className="text-red-500 text-sm mb-4">
              {errors.venue.message}
            </Text>
          )}

          {/* --- Instructions --- */}
          <Text className="mb-1 mt-2 font-semibold text-gray-700">
            Instructions (optional)
          </Text>
          <Controller
            control={control}
            name="instructions"
            render={({ field: { value, onChange } }) => (
              <TextInput
                placeholder="Any special note or instructions"
                value={value}
                onChangeText={onChange}
                multiline={true}
                numberOfLines={5}
                textAlignVertical="top"
                placeholderTextColor="#9CA3AF" // gray-400
                className="border border-gray-300 rounded-xl p-4 mb-8 text-gray-800 bg-gray-50"
              />
            )}
          />

          {/* --- Submit Button --- */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="bg-green-600 active:scale-95 transition-all duration-300 py-4 rounded-full items-center shadow-md"
          >
            {isSubmitting ? (
              <View className="flex-row gap-2 items-center">
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white font-semibold">Scheduling...</Text>
              </View>
            ) : (
              <Text className="text-white font-semibold text-base">
                Add Schedule
              </Text>
            )}
          </Pressable>

          <Text className="text-gray-400 text-center text-xs mt-5">
            Your new schedule will appear in your list once added.
          </Text>
        </ScrollView>
      </KeyboardAwareScrollView>
    </>
  );
}
