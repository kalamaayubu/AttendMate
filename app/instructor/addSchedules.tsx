import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
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
  // Form states
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [venue, setVenue] = useState("");
  const [directions, setDirections] = useState("");

  // Datepicker visibility states (for Android)
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Handlers for date changes
  const onChangeStart = (event: any, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === "ios"); // keep open on iOS
    if (selectedDate) setStartTime(selectedDate);
  };

  const onChangeEnd = (event: any, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === "ios");
    if (selectedDate) setEndTime(selectedDate);
  };

  const handleSubmit = () => {
    // Basic validation
    if (!venue.trim()) {
      alert("Please enter the venue");
      return;
    }
    if (endTime <= startTime) {
      alert("End time must be after start time");
      return;
    }

    // Build schedule object
    const newSchedule = {
      course: selectedCourse,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      venue,
      directions,
    };

    // For now just log it
    console.log("New Schedule:", newSchedule);
    alert("Schedule added successfully!");

    // TODO: Add real submission logic, then navigate back or reset form
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Add Schedule",
          headerTintColor: "white",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#16a34a",
            elevation: 0,
          },
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerBackTitleVisible: false,
        }}
      />
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          backgroundColor: "white",
          flexGrow: 1,
        }}
      >
        {/* Course picker */}
        <Text className="mb-1 font-semibold text-gray-700">Select course</Text>
        <View className="overflow-hidden mb-5 rounded-full border-[#ccc] border">
          <Picker
            selectedValue={selectedCourse}
            onValueChange={(itemValue) => setSelectedCourse(itemValue)}
            mode="dialog"
          >
            {courses.map((course) => (
              <Picker.Item key={course} label={course} value={course} />
            ))}
          </Picker>
        </View>

        {/* Start Time */}
        <Text className="mb-1 font-semibold text-gray-700">Start Time</Text>
        <TouchableOpacity
          onPress={() => setShowStartPicker(true)}
          className="mb-5 rounded-full border boder-[#ccc] p-4"
        >
          <Text>{startTime.toLocaleString()}</Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startTime}
            mode="datetime"
            is24Hour={false}
            display="default"
            onChange={onChangeStart}
          />
        )}

        {/* End Time */}
        <Text className="mb-1 font-semibold text-gray-700">End Time</Text>
        <TouchableOpacity
          onPress={() => setShowEndPicker(true)}
          className="mb-5 rounded-full border boder-[#ccc] p-4"
        >
          <Text>{endTime.toLocaleString()}</Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={endTime}
            mode="datetime"
            is24Hour={false}
            display="default"
            onChange={onChangeEnd}
          />
        )}

        {/* Venue */}
        <Text className="mb-1 font-semibold text-gray-700">Venue</Text>
        <TextInput
          placeholder="Enter venue"
          value={venue}
          onChangeText={setVenue}
          className="mb-5 rounded-full border boder-[#ccc] p-4"
        />

        {/* Directions (optional) */}
        <Text className="mb-1 font-semibold text-gray-700">
          Directions (optional)
        </Text>
        <TextInput
          placeholder="Any notes or instructions for the class"
          value={directions}
          onChangeText={setDirections}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          className="border border-gray-300 rounded-md p-3 mb-8 text-base text-gray-800"
        />

        {/* Submit Button */}
        <Pressable
          onPress={handleSubmit}
          className="bg-green-600 active: scale-95 transition-all duration-300 py-3 rounded-full items-center"
        >
          <Text className="text-white font-semibold text-base">
            Add Schedule
          </Text>
        </Pressable>
      </ScrollView>
    </>
  );
}
