import CustomHeader from "@/components/general/CustomHeader";
import DateTimeField from "@/components/general/DateTimeField";
import { ScheduleForm } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { RootState } from "@/redux/store";
import { schedulesService } from "@/services/schedulesService";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

// Handling dates
import { coursesService } from "@/services/coursesService";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export default function AddSchedule() {
  // Get instructor ID from redux
  const { user } = useSelector((state: RootState) => state.user);
  const [myCourses, setMyCourses] = useState<
    { id: string; code: string; name: string }[]
  >([]);

  // Fetch the courses of an instructor
  useEffect(() => {
    const fetchMyCourses = async () => {
      if (!user) return;
      const res = await coursesService.getMyCoursesOnly(user?.id);

      if (!res.success) {
        console.error("Error fetching ONLY instructor courses", res.error);
      }

      if (!res.data) return;
      setMyCourses(res?.data);
    };

    fetchMyCourses();
  }, [user]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleForm>({
    defaultValues: {
      course: "",
      startTime: "",
      endTime: "",
      venue: "",
      instructions: "",
    },
  });

  // Function to handle the addition of a schedule
  const onSubmit = async (data: ScheduleForm) => {
    if (!data.startTime || !data.endTime) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Please select both start and end times.",
      });
      return;
    }

    console.log("🕒 Submitted Start Time:", data.startTime);
    console.log("🕓 Submitted End Time:", data.endTime);

    const payload = {
      ...data,
      // Always store dates & time in utc and display in local
      startTime: dayjs(data.startTime).utc().format(),
      endTime: dayjs(data.endTime).utc().format(),
      instructorId: user?.id,
    };

    const res = await schedulesService.addSchedule(payload);
    if (!res.success) {
      Toast.show({
        type: "error",
        text1: "Error adding schedule",
        text2: res.message,
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Schedule added successfully!",
    });
    reset();
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

      {/* Make the scroll view aware of keyboard*/}
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
          <View className="mb-6 p-5 rounded-xl">
            <View className="flex-row items-center gap-3 mb-2">
              <View className="bg-black p-2 rounded-xl">
                <Ionicons name="create-outline" size={22} color="white" />
              </View>
              <Text className="text-2xl font-bold text-gray-800">
                Create New Schedule
              </Text>
            </View>

            <Text className="text-gray-600 text-lg">
              Fill in the course details, venue, and timings below to create a
              new schedule.
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
                  dropdownIconColor="#6366f1"
                  style={{
                    color: "#374151",
                    backgroundColor: "#f9fafb",
                    height: 52,
                  }}
                >
                  <Picker.Item
                    label="Select a course"
                    value=""
                    color="#9CA3AF"
                  />
                  {myCourses.map((course) => (
                    <Picker.Item
                      key={course.id}
                      label={course.name}
                      value={course.id}
                    />
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
            rules={{
              required: "Start time is required",
            }}
          />
          {errors.startTime && (
            <Text className="text-red-500 text-sm -translate-y-4 mb-2">
              {errors.startTime.message}
            </Text>
          )}

          <DateTimeField
            control={control}
            name="endTime"
            label="End Time"
            timeOnly
            rules={{
              required: "End time is required",
              validate: (value: any, formValues: any) => {
                // Validation logic
                if (!formValues.startTime) return "Start time is missing";
                if (!value) return "End time is missing";

                const start = new Date(formValues.startTime);
                const end = new Date(value);

                if (isNaN(start.getTime()) || isNaN(end.getTime()))
                  return "Invalid date values";

                if (end <= start)
                  return "End time must be after the start time";

                return true;
              },
            }}
          />
          {errors.endTime && (
            <Text className="text-red-500 text-sm -translate-y-4 mb-2">
              {errors.endTime.message}
            </Text>
          )}

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
            className="bg-indigo-500 active:scale-95 transition-all duration-300 py-4 rounded-full items-center shadow-md"
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

          <Text className="text-gray-400 -translate-y-2 text-center text-xs mt-5">
            Your new schedule will appear in your list once added.
          </Text>
        </ScrollView>
      </KeyboardAwareScrollView>
    </>
  );
}
