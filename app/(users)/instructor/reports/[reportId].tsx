import CustomHeader from "@/components/general/CustomHeader";
import FinalReportModal from "@/components/instructor/FinalReportModal";
import { RootState } from "@/redux/store";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const AttendanceReport = () => {
  const [openFinalReportModal, setOpenFinalReportModal] = useState(false);
  const { data } = useSelector((state: RootState) => state.reportData);

  if (!data) {
    return (
      <View style={{ padding: 20 }}>
        <Text>How did you made it here without first generating report?.</Text>
      </View>
    );
  }

  const { enrollments, attendance } = data;

  // 1️⃣ Collect all unique schedules (sorted by time)
  const schedules = [
    ...new Map(
      attendance.map((a: any) => [a.schedule_id, a.schedule])
    ).values(),
  ].sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1">
      <CustomHeader title="Attendance Report" backButton />

      {/* Top Info Section */}
      <View className="m-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-100">
        <Text className="text-lg font-semibold text-gray-800 mb-1">
          {enrollments?.[0]?.course?.course_name || "Course Name"}
        </Text>
        <Text className="text-gray-600 mb-2">
          Code: {enrollments?.[0]?.course?.course_code || "N/A"}
        </Text>
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-gray-700">
            Total Students:{" "}
            <Text className="font-semibold">{enrollments?.length}</Text>
          </Text>

          <TouchableOpacity
            onPress={() => setOpenFinalReportModal(true)}
            className="bg-indigo-500 px-4 py-2 rounded-full"
          >
            <Text className="text-white font-semibold">View Final Report</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Table */}
      <ScrollView horizontal>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.headerCell, { minWidth: 40 }]}>
              S/NO
            </Text>
            <Text style={[styles.cell, styles.headerCell, { minWidth: 160 }]}>
              Name
            </Text>
            <Text style={[styles.cell, styles.headerCell, { minWidth: 120 }]}>
              Reg No
            </Text>
            {schedules.map((schedule) => (
              <Text
                key={schedule.start_time}
                style={[styles.cell, styles.headerCell, { minWidth: 100 }]}
              >
                {new Date(schedule.start_time).toLocaleDateString()}
              </Text>
            ))}
          </View>

          {/* Table Body */}
          {enrollments.map((enrollment, index) => {
            const student = enrollment.students;
            return (
              <View key={student.id} style={styles.row}>
                <Text style={[styles.cell, { minWidth: 52 }]}>{index + 1}</Text>
                <Text style={[styles.cell, { minWidth: 160 }]}>
                  {student.profiles.full_name}
                </Text>
                <Text style={[styles.cell, { minWidth: 120 }]}>
                  {student.reg_no}
                </Text>

                {/* For each schedule, mark if attended */}
                {schedules.map((schedule) => {
                  console.log("THE UNDEFINED SCHEDULEID:::", schedule.id);
                  const attended = attendance.some(
                    (a) =>
                      a.schedule_id === schedule.id &&
                      a.student_id === student.id
                  );
                  return (
                    <Text
                      key={schedule.id + student.id}
                      style={[
                        styles.cell,
                        { minWidth: 100, textAlign: "center" },
                        attended ? styles.presentCell : styles.absentCell,
                      ]}
                    >
                      {attended ? "✓" : "×"}
                    </Text>
                  );
                })}
              </View>
            );
          })}
        </View>
      </ScrollView>
      <FinalReportModal
        visible={openFinalReportModal}
        onClose={() => setOpenFinalReportModal(false)}
        data={data}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerRow: {
    backgroundColor: "#f7f7f7",
  },
  cell: {
    padding: 10,
    borderRightWidth: 1,
    borderColor: "#eee",
    fontSize: 13,
  },
  headerCell: {
    fontWeight: "bold",
    textAlign: "center",
  },
  presentCell: {
    color: "green",
    fontWeight: "bold",
  },
  absentCell: {
    color: "red",
    fontWeight: "bold",
  },
});

export default AttendanceReport;
