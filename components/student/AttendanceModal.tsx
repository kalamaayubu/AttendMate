import { requestBiometricPermission } from "@/utils/biometricAuth"; // adjust path as needed
import { Ionicons } from "@expo/vector-icons";
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
            <Text
              className={`mb-4 text-center ${
                attendanceResult.includes("successfully") ? (
                  <View>
                    <Ionicons
                      name="checkmark-circle"
                      size={64}
                      color="#22c55e"
                    />
                  </View>
                ) : (
                  "text-red-600"
                )
              }`}
            >
              {attendanceResult.includes("successfully") ? (
                <View className="items-center">
                  <Ionicons name="checkmark-circle" size={80} color="#22c55e" />
                  <Text className="text-2xl font-semibold mt-4 text-green-600">
                    Congratulations
                  </Text>
                  <Text className="text-gray-700 mt-2 mb-6">
                    Attendance marked successfully!!
                  </Text>
                </View>
              ) : (
                <View className="items-center">
                  <Ionicons name="close-circle" size={80} color="#f97316" />
                  <Text className="text-2xl font-semibold mt-4 text-orange-500">
                    Verification Failed
                  </Text>
                  <Text className="text-gray-500 mt-2 mb-6 text-center">
                    {attendanceResult}
                  </Text>
                </View>
              )}
            </Text>
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
