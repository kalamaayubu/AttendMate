import CustomHeader from "@/components/general/CustomHeader";
import AttendanceModal from "@/components/student/AttendanceModal";
import { schedulesService } from "@/services/schedulesService";
import { StudentScheduleDetails } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

// dayjs for time conversions
import { RootState } from "@/redux/store";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from "react-redux";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(calendar);

export default function ScheduleDetails() {
  const scheduleId = useLocalSearchParams().scheduleId as string;
  const student = useSelector((state: RootState) => state.user.user); // Logged in user
  const [loading, setLoading] = useState(true);
  const [openInstructions, setOpenInstructions] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [locationCheck, setLocationCheck] = useState<{
    success: boolean;
    isWithin?: boolean;
    distance?: number;
    error?: string;
  } | null>(null);
  const [scheduleDetails, setScheduleDetails] =
    useState<StudentScheduleDetails | null>(null);

  // Fetch schedule details when component mounts
  useEffect(() => {
    const fetchScheduleDetails = async () => {
      setLoading(true);
      try {
        if (!student) return;
        const res = await schedulesService.getScheduleDetailsForStudent(
          scheduleId as string,
          student?.id as string
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
  }, [scheduleId, student]);

  // Location check when component mount
  useEffect(() => {
    const checkLocation = async () => {
      if (!scheduleId || Array.isArray(scheduleId)) return;
      const res = await schedulesService.isWithinLocation(scheduleId);
      setLocationCheck(res);
    };

    checkLocation();
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

  // If student have already marked the attendance
  const hasMarkedAttendance = scheduleDetails.attendance?.length > 0;

  // Time check
  const now = dayjs(); // local time
  const isWithinScheduleTime = now.isAfter(start) && now.isBefore(end);

  // Location check
  const isWithinVenueLocation = locationCheck?.isWithin ?? false;

  // Attendance marking conditions met
  const canMarkAttendance = isWithinScheduleTime && isWithinVenueLocation;

  // Determine why student cannot mark attendance
  const reasons: string[] = [];
  if (!isWithinScheduleTime)
    reasons.push("The class time has not started or has already ended.");
  if (!isWithinVenueLocation) reasons.push("You are not in the class venue.");

  const reason = reasons.join(" ");

  return (
    <>
      <SafeAreaView edges={["left", "right"]} className="flex-1 bg-gray-50">
        <CustomHeader title={`${scheduleDetails?.courseCode}`} backButton />
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          {/* ===== Header Card with Gradient ===== */}

          <View className="p-5 gap-2 rounded-2xl mb-10 bg-green-100 border border-green-200">
            <Text className="text-2xl font-semibold text-green-600 mb-1">
              {scheduleDetails?.courseName}
            </Text>
            <Text className="font-semibold text-gray-800">{friendlyDate}</Text>
            <Text className="text-sm text-gray-700">{friendlyTime}</Text>

            <View className="flex-row items-center mt-2">
              <Ionicons name="location-outline" size={16} color={"black"} />
              <Text className="ml-1 text-sm text-gray-600">
                {scheduleDetails?.venue}
              </Text>
            </View>

            <View className="flex-row items-center mt-1">
              <Ionicons name="person-outline" size={16} color={"black"} />
              <Text className="ml-1 text-sm text-gray-600">
                {scheduleDetails?.instructorName}
              </Text>
            </View>
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
            ${
              hasMarkedAttendance
                ? "bg-green-500"
                : canMarkAttendance
                ? "bg-indigo-500"
                : "bg-gray-400"
            }
          `}
          onPress={() => {
            if (hasMarkedAttendance) {
              Toast.show({
                type: "info",
                text1: "Already Marked",
                text2: "You've already marked attendance for this class.",
              });
              return;
            }
            if (canMarkAttendance) setModalVisible(true);
            else
              Toast.show({
                type: "error",
                text1: "Cannot Mark Attendance",
                text2: reason,
              });
          }}
        >
          <Ionicons
            name={
              hasMarkedAttendance
                ? "checkmark-done-outline"
                : canMarkAttendance
                ? "checkmark-outline"
                : "time-outline"
            }
            size={28}
            color="white"
          />
        </Pressable>

        {/* ===== Attendance Modal ===== */}
        <AttendanceModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          scheduleId={scheduleId}
        />
      </SafeAreaView>
    </>
  );
}
