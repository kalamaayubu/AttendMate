import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface FinalReportModalProps {
  visible: boolean;
  onClose: () => void;
  data: any;
}

const FinalReportModal: React.FC<FinalReportModalProps> = ({
  visible,
  onClose,
  data,
}) => {
  if (!data) return null;

  const { enrollments, attendance } = data;

  //  Collect unique schedules
  const schedules = [
    ...new Map(
      attendance.map((a: any) => [a.schedule_id, a.schedule])
    ).values(),
  ].sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

  return (
    <Modal
      animationType="slide"
      visible={visible}
      transparent
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <View className="flex-1 bg-black/40">
        {/* Modal Container */}
        <View className="bg-white absolute w-full bottom-0 right-0 rounded-t-3xl h-[96%] shadow-md">
          {/* Header */}
          <View className="flex-row p-6 pb-4 justify-between items-center mb-3">
            <Text className="text-2xl font-bold text-gray-800">
              Final Report
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="bg-gray-300/40 items-center rounded-full justify-center"
            >
              <Ionicons name="close" className="p-2" size={20} />
            </TouchableOpacity>
          </View>

          {/* Scrollable Table */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View className="w-3/4 justify-center items-center">
                <View className="border gap-4 border-b-0 scale-75 -translate-y-6 border-gray-300 bg-white">
                  {/* Report titles */}
                  <View className="p-2 mb-6">
                    <Text className="text-lg">
                      INSTRUCTOR:{" "}
                      {
                        enrollments?.[0]?.course?.instructor_courses?.[0]
                          ?.instructor?.profiles?.full_name
                      }
                    </Text>
                    <Text className="text-lg">
                      COURSE NAME: {enrollments?.[0]?.course?.course_name}
                    </Text>
                    <Text className="text-lg">
                      COURSE CODE: {enrollments?.[0]?.course?.course_code}
                    </Text>
                  </View>

                  {/* Table Header */}
                  <View className="flex-row border-b border-t border-gray-200 bg-gray-50">
                    <Text className="p-2 min-w-10 text-center font-bold text-gray-700 border-r border-gray-200">
                      S/NO
                    </Text>
                    <Text className="p-2 min-w-40 text-center font-bold text-gray-700 border-r border-gray-200">
                      Student
                    </Text>
                    <Text className="p-2 min-w-32 text-center font-bold text-gray-700 border-r border-gray-200">
                      Reg No
                    </Text>
                    <Text className="p-2 min-w-28 text-center font-bold text-gray-700">
                      Attendance
                    </Text>
                  </View>

                  {/* Table Body */}
                  {enrollments.map((enrollment: any, index: number) => {
                    const student = enrollment.students;
                    const attendedCount = attendance.filter(
                      (a: any) => a.student_id === student.id
                    ).length;
                    const attendanceRate = (
                      (attendedCount / schedules.length) *
                      100
                    ).toFixed(0);

                    const rateColor =
                      Number(attendanceRate) >= 75
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold";

                    return (
                      <View
                        key={student.id}
                        className="flex-row border-b border-gray-200"
                      >
                        <Text className="p-2 min-w-[48px] text-center border-r border-gray-200 text-gray-700">
                          {index + 1}
                        </Text>
                        <Text className="p-2 min-w-40 border-r border-gray-200 text-gray-700">
                          {student.profiles.full_name}
                        </Text>
                        <Text className="p-2 min-w-32 border-r border-gray-200 text-gray-700">
                          {student.reg_no}
                        </Text>
                        <Text
                          className={`p-2 min-w-32 text-center ${rateColor}`}
                        >
                          {attendanceRate}%
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </ScrollView>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default FinalReportModal;
