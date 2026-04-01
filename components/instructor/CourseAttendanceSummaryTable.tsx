import { Text, View } from "react-native";

type CourseAttendanceRow = {
  name: string;
  attendance: number;
  color?: string;
};

type CourseAttendanceSummaryTableProps = {
  rows: CourseAttendanceRow[];
  title?: string;
};

export default function CourseAttendanceSummaryTable({
  rows,
  title = "Course Attendance Summary",
}: CourseAttendanceSummaryTableProps) {
  return (
    <View className="px-4 mt-4">
      <Text className="text-gray-700 font-bold mb-2">{title}</Text>
      <View className="bg-white rounded-xl shadow overflow-hidden">
        <View className="flex-row bg-green-600/20 px-3 py-2">
          <Text className="flex-1 font-semibold text-gray-700">Course</Text>
          <Text className="w-24 text-center font-semibold text-gray-700">
            Attendance
          </Text>
        </View>
        {rows.map((row, idx) => (
          <View
            key={row.name}
            className={`flex-row px-3 py-2 ${
              idx % 2 === 0 ? "bg-white" : "bg-gray-50"
            }`}
          >
            <Text className="flex-1 text-gray-700">{row.name}</Text>
            <Text className="w-24 text-center text-gray-700">
              {row.attendance}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

