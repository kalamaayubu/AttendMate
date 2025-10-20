import CustomHeader from "@/components/general/CustomHeader";
import AttendanceModal from "@/components/student/AttendanceModal";
import { schedulesService } from "@/services/schedulesService";
import { StudentScheduleDetails } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

// dayjs for time conversion
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(calendar);

export default function ScheduleDetails() {
  const { scheduleId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [openInstructions, setOpenInstructions] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [scheduleDetails, setScheduleDetails] =
    useState<StudentScheduleDetails | null>(null);

  // Fetch schedule details when component mounts
  useEffect(() => {
    const fetchScheduleDetails = async () => {
      setLoading(true);
      try {
        const res = await schedulesService.getScheduleDetailsForStudent(
          scheduleId as string
        );
        setLoading(false);

        if (!res.success) {
          Toast.show({
            type: "error",
            text1: "Something went wrong",
            text2: res?.error || "Unknown error occurred, ",
          });
          return;
        }

        if (!res.data) return;
        setScheduleDetails(res.data);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching schedule details:", error);
        Toast.show({
          type: "error",
          text1: "Something went wrong",
          text2: "Failed to load schedule details.",
        });
      }
    };

    fetchScheduleDetails();
  }, [scheduleId]);

  // Show loading state
  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="text-gray-500 mt-2">Loading schedule details...</Text>
      </SafeAreaView>
    );
  }

  // Show if no details
  if (!scheduleDetails) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-500">No details available.</Text>
      </SafeAreaView>
    );
  }

  //  Format date & time nicely with dayjs
  const start = dayjs(scheduleDetails.startTime);
  const end = dayjs(scheduleDetails.endTime);
  const friendlyDate = start.calendar(null, {
    sameDay: "[Today]",
    nextDay: "Tomorrow",
    nextWeek: "dddd, MMM D",
    lastDay: "[Yesterday]",
    lastWeek: "dddd, MMM D",
    sameElse: "dddd, MMM D, YYYY",
  });
  const friendlyTime = `${start.format("h:mm A")} - ${end.format("h:mm A")}`;

  // TIme check
  const now = dayjs(); // local time
  const isWithinScheduleTime = now.isAfter(start) && now.isBefore(end);
  console.log("IS WITHIN TIME:", isWithinScheduleTime);

  const place = true; // change to false to simulate not in classroom
  const canMarkAttendance = isWithinScheduleTime && place;

  // Determine why student cannot mark attendance
  const reasons: string[] = [];
  if (!isWithinScheduleTime)
    reasons.push("The class time has not started or has already ended.");
  if (!place) reasons.push("You are not in the class venue.");

  const reason = reasons.join(" ");

  return (
    <>
      <SafeAreaView edges={["left", "right"]} className="flex-1 bg-gray-50">
        <CustomHeader title={`${scheduleDetails?.courseCode}`} backButton />
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          {/* ===== Header Card with Gradient ===== */}
          <View
            className="rounded-2xl shadow-gray-600 shadow-2xl mb-4"
            style={{
              overflow: "hidden",
              borderLeftWidth: 5,
              borderLeftColor: "#16a34a",
            }}
          >
            <LinearGradient
              colors={["#ffff", "#ffff"]}
              start={[0, 0]}
              end={[1, 1]}
              className="p-5 gap-3"
            >
              <Text className="text-2xl font-semibold text-gray-800 mb-1">
                {scheduleDetails?.courseName}
              </Text>
              <Text className=" text-gray-700">{friendlyDate}</Text>
              <Text className="text-sm text-gray-700">{friendlyTime}</Text>

              <View className="flex-row items-center mt-2">
                <Ionicons name="location-outline" size={16} color={"gray"} />
                <Text className="ml-1 text-sm text-gray-500">
                  {scheduleDetails?.venue}
                </Text>
              </View>

              <View className="flex-row items-center mt-1">
                <Ionicons name="person-outline" size={16} color={"gray"} />
                <Text className="ml-1 text-sm text-gray-500">
                  {scheduleDetails?.instructorName}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* ===== Attendance Progress Bar ===== */}
          <View className="bg-white rounded-2xl shadow p-4 mb-4">
            <Text className="text-xl font-semibold text-gray-800 mb-2">
              Attendance
            </Text>
            <Text className="text-gray-600">Total Sessions:</Text>
            <Text className="text-gray-600">Attended:</Text>
            <View className="bg-gray-200 h-2 rounded-full mt-2">
              <View
                className="h-2 rounded-full bg-green-500"
                style={{ width: `${20}%` }}
              />
            </View>
          </View>

          {/* ===== instructions (collapsible) ===== */}
          <View className="bg-white rounded-2xl shadow p-4 mb-4">
            <TouchableOpacity
              className="flex-row justify-between items-center"
              onPress={() => setOpenInstructions(!openInstructions)}
            >
              <Text className="text-xl font-semibold text-gray-800">
                Lesson Guideline
              </Text>
              <Ionicons
                name={
                  openInstructions
                    ? "chevron-up-outline"
                    : "chevron-down-outline"
                }
                size={20}
                color="#888"
              />
            </TouchableOpacity>
            {openInstructions && (
              <Text className=" text-gray-500 leading-6 mt-2">
                {scheduleDetails?.instructions}
              </Text>
            )}
          </View>
        </ScrollView>

        {/* ===== Floating Action Button ===== */}
        <Pressable
          className={`absolute bottom-16 right-6 w-16 h-16 rounded-full items-center justify-center shadow-lg
          ${canMarkAttendance ? "bg-indigo-500" : "bg-gray-400"}`}
          onPress={() => {
            if (canMarkAttendance) setModalVisible(true);
            else
              Toast.show({
                type: "error",
                text1: "Cannot Mark Attendance",
                text2: reason,
              });
          }}
        >
          <Ionicons name="checkmark-outline" size={28} color="white" />
        </Pressable>

        {/* ===== Modal for disabled FAB(Floating Action Button) ===== */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable
            className="flex-1 justify-center items-center bg-black/50"
            onPress={() => setModalVisible(false)}
          >
            <View className="bg-white rounded-xl p-6 w-80">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Cannot Mark Attendance
              </Text>
              <Text className="text-sm text-gray-600">{reason}</Text>
              <Pressable
                className="mt-6 bg-green-600 py-2 rounded-lg"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-white text-center font-semibold">OK</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>

        {/* ===== Attendance Modal ===== */}
        <AttendanceModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </SafeAreaView>
    </>
  );
}
