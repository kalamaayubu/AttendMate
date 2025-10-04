import { ScheduleForm } from "@/types";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
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
      directions: "",
    },
  });

  // Datepicker visibility states (for Android)
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Function to handle schedule submission
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

    console.log("New Schedule:", newSchedule);
    alert("Schedule added successfully!");
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Add Schedule",
          headerTintColor: "#4B5563",
          headerShown: true,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        }}
      />
      <StatusBar style="auto" />
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          backgroundColor: "white",
          justifyContent: "center",
          flexGrow: 1,
        }}
      >
        {/* Course picker */}
        <Text className="mb-1 font-semibold text-gray-700">Select course</Text>
        <View className="overflow-hidden mb-5 rounded-full border-[#ccc] border">
          <Controller
            control={control}
            name="course"
            rules={{
              required: "Please select a course",
            }}
            render={({ field: { onChange, value } }) => (
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                mode="dialog"
              >
                <Picker.Item
                  label="Course name here"
                  value=""
                  enabled={false}
                  color="green"
                />
                {courses.map((course) => (
                  <Picker.Item key={course} label={course} value={course} />
                ))}
              </Picker>
            )}
          />
        </View>

        {/* Start Time */}
        <Text className="mb-1 font-semibold text-gray-700">Start Time</Text>
        <Controller
          control={control}
          name="startTime"
          render={({ field: { onChange, value } }) => (
            <>
              <TouchableOpacity
                onPress={() => setShowStartPicker(true)}
                className="mb-5 rounded-full border border-[#ccc] p-4"
              >
                <Text>
                  {value ? value.toLocaleString() : "Select start time"}
                </Text>
              </TouchableOpacity>
              {showStartPicker && (
                <DateTimePicker
                  value={value ?? new Date()}
                  mode="datetime"
                  is24Hour={false}
                  display="default"
                  onChange={(event, selectedDate) => {
                    if (Platform.OS === "android") {
                      setShowStartPicker(false); // Close the picker
                      if (event.type === "set" && selectedDate) {
                        onChange(selectedDate);
                      }
                    } else if (selectedDate) {
                      // iOS just sends date continuously
                      onChange(selectedDate);
                    }
                  }}
                />
              )}
            </>
          )}
        />

        {/* End Time */}
        <Text className="mb-1 font-semibold text-gray-700">End Time</Text>
        <Controller
          control={control}
          name="endTime"
          render={({ field: { value, onChange } }) => (
            <>
              <TouchableOpacity
                onPress={() => setShowEndPicker(true)}
                className="mb-5 rounded-full border border-[#ccc] p-4"
              >
                <Text>
                  {value ? value.toLocaleString() : "Select lesson end time"}
                </Text>
              </TouchableOpacity>
              {showEndPicker && (
                <DateTimePicker
                  value={value ?? new Date()}
                  mode="datetime"
                  is24Hour={false}
                  display="default"
                  onChange={(event, date) => {
                    if (Platform.OS === "android") {
                      if (event.type === "set" && date) {
                        onChange(date);
                      }
                      setShowEndPicker(false);
                    } else {
                      // iOS just sends date continuously
                      if (date) onChange(date);
                    }
                  }}
                />
              )}
            </>
          )}
        />

        {/* Venue */}
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
              className="mb-1 rounded-lg border border-[#ccc] p-4"
            />
          )}
        />
        {errors.venue && (
          <Text className="text-red-500 text-sm mb-5">
            {errors.venue.message}
          </Text>
        )}

        {/* Directions (optional) */}
        <Text className="mb-1 font-semibold text-gray-700">
          Directions (optional)
        </Text>
        <Controller
          control={control}
          name="directions"
          render={({ field: { value, onChange } }) => (
            <TextInput
              placeholder="Any notes or instructions for the class"
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              className="border border-gray-300 rounded-md p-3 mb-8 text-base text-gray-800"
            />
          )}
        />

        {/* Submit Button */}
        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="bg-green-600 active:scale-95 transition-all duration-300 py-3 rounded-full items-center"
        >
          {isSubmitting ? (
            <View className="flex-row gap-2 items-center">
              <ActivityIndicator size="small" color="white" />
              <Text className="text-white font-semibold">Scheduling...</Text>
            </View>
          ) : (
            <Text className="text-white font-semibold">Add Schedule</Text>
          )}
        </Pressable>
      </ScrollView>
    </>
  );
}
