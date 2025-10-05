import { requestBiometricPermission } from "@/utils/biometricAuth"; // adjust path as needed
import React, { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

interface AttendanceModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AttendanceModal({
  visible,
  onClose,
}: AttendanceModalProps) {
  const [attendanceResult, setAttendanceResult] = useState<null | string>(null);

  const handleMarkAttendance = async () => {
    // Check student against biometrics credentials
    const biometric = await requestBiometricPermission();

    if (!biometric.success) {
      setAttendanceResult(biometric.message);
      return;
    }

    // 🔹 If biometrics succeed, simulate marking attendance
    const success = true; // replace with API call
    if (success) setAttendanceResult("Attendance marked successfully!");
    else setAttendanceResult("Failed to mark attendance. Try again.");
  };
  Place;
  const handleClose = () => {
    setAttendanceResult(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full">
          <Text className="text-lg font-semibold mb-4">Confirm Attendance</Text>
          <Text className="text-sm text-gray-700 mb-6">
            Attendmate wants to ensure its you, verify your identity.
          </Text>

          {attendanceResult && (
            <Text
              className={`mb-4 font-medium ${
                attendanceResult.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {attendanceResult}
            </Text>
          )}

          <View className="flex-row justify-end gap-3">
            <Pressable
              className="px-4 py-2 rounded-lg bg-gray-200"
              onPress={handleClose}
            >
              <Text>Cancel</Text>
            </Pressable>

            {!attendanceResult && (
              <Pressable
                className="px-4 py-2 rounded-lg bg-green-600"
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
