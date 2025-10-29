import { RootState } from "@/redux/store";
import { schedulesService } from "@/services/schedulesService";
import { requestBiometricPermission } from "@/utils/biometricAuth"; // adjust path as needed
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

interface AttendanceModalProps {
  visible: boolean;
  onClose: () => void;
  scheduleId: string;
}

export default function AttendanceModal({
  visible,
  onClose,
  scheduleId,
}: AttendanceModalProps) {
  const [attendanceResult, setAttendanceResult] = useState<null | string>(null);
  // Get student id from the store
  const student = useSelector((state: RootState) => state.user.user);

  // Function to add attendance marked by student
  const handleMarkAttendance = async () => {
    // Check student against biometrics credentials
    const biometric = await requestBiometricPermission();

    if (!biometric.success) {
      setAttendanceResult(biometric.message);
      return;
    }

    // 🔹 If biometrics succeed, mark attendance
    if (!student) return;
    const res = await schedulesService.markAttendance(student?.id, scheduleId);

    if (!res.success) {
      setAttendanceResult("Failed to mark attendance. Try again.");
      Toast.show({
        type: "error",
        text1: "An error occured",
        text2: res.error,
      });
      return;
    }

    // Success
    setAttendanceResult("Attendance marked successfully");
    Toast.show({
      type: "success",
      text1: "Attendance marked successfully",
    });

    router.reload();
  };
  const handleClose = () => {
    setAttendanceResult(null);
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={handleClose}
    >
      <Pressable onPress={handleClose} className="flex-1 bg-black/50" />

      <View className="flex-1 absolute bottom-0 w-full justify-center items-center">
        <View className="bg-white rounded-t-3xl pt-4 p-6 pb-16 py-8 w-full">
          <View className="items-center mt-6">
            {attendanceResult ? (
              ""
            ) : (
              <>
                <Text className="text-xl font-semibold mb-4">
                  Confirm Attendance
                </Text>
                <Text className="text-center text-gray-600 mb-6">
                  Is this you? Verify your identity.
                </Text>
              </>
            )}
          </View>

          {attendanceResult && (
            <View className="items-center mb-6">
              {attendanceResult.includes("successfully") ? (
                <>
                  <Ionicons name="checkmark-circle" size={80} color="#22c55e" />
                  <Text className="text-2xl font-semibold mt-4 text-green-600">
                    Congratulations
                  </Text>
                  <Text className="text-gray-700 mt-2 mb-6 text-center">
                    Attendance marked successfully!!
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="close-circle" size={80} color="#f97316" />
                  <Text className="text-2xl font-semibold mt-4 text-orange-500">
                    Verification Failed
                  </Text>
                  <Text className="text-gray-500 mt-2 mb-6 text-center">
                    {attendanceResult}
                  </Text>
                </>
              )}
            </View>
          )}

          <View className="items-center mt-6">
            {!attendanceResult && (
              <Pressable
                className="px-6 py-2 rounded-full bg-green-600"
                onPress={handleMarkAttendance}
              >
                <Text className="text-white">Verify Identity</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
