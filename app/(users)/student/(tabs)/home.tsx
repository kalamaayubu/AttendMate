import StudentDashboardSkeleton from "@/components/dashboard/StudentDashboardSkeleton";
import CustomHeader from "@/components/general/CustomHeader";
import CustomRefreshControl from "@/components/general/RefreshControl";
import { supabase } from "@/lib/supabase";
import { RootState } from "@/redux/store";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const screenWidth = Dimensions.get("window").width;

const PIE_COLORS = [
  "#3b82f6",
  "#16a34a",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
];

function clampPercent(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

type QuickStat = {
  id: string;
  title: string;
  value: string | number;
  icon: string;
  color: string;
};

type TableRow = { unit: string; total: number; attended: number };

type PieSlice = {
  name: string;
  attendance: number;
  color: string;
};

const defaultQuickStats: QuickStat[] = [
  {
    id: "1",
    title: "Enrolled courses",
    value: 0,
    icon: "school-outline",
    color: "#fb923c",
  },
  {
    id: "2",
    title: "Attended",
    value: 0,
    icon: "checkmark-done-circle-outline",
    color: "#16a34a",
  },
  {
    id: "3",
    title: "Score",
    value: "0%",
    icon: "trophy-outline",
    color: "#6366f1",
  },
];

export default function StudentDashboard() {
  const user = useSelector((state: RootState) => state.user.user);
  const studentId = user?.id;

  const [quickStats, setQuickStats] = useState<QuickStat[]>(defaultQuickStats);
  const [attendanceTrend, setAttendanceTrend] = useState({
    labels: ["—"],
    datasets: [{ data: [0], strokeWidth: 3 }],
  });
  const [attendancePie, setAttendancePie] = useState<PieSlice[]>([
    { name: "—", attendance: 0, color: "#e5e7eb" },
  ]);
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = useCallback(
    async (opts?: { showLoading?: boolean }) => {
      const showLoading = opts?.showLoading ?? true;
    if (!studentId) {
      setQuickStats(defaultQuickStats);
      setAttendanceTrend({
        labels: ["—"],
        datasets: [{ data: [0], strokeWidth: 3 }],
      });
      setAttendancePie([{ name: "—", attendance: 0, color: "#e5e7eb" }]);
      setTableData([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (showLoading) setLoading(true);
    else setRefreshing(true);
    try {
      const { data: enrollmentRows, error: enrollErr } = await supabase
        .from("enrollments")
        .select("course_id")
        .eq("student_id", studentId);

      if (enrollErr) {
        console.error("Student dashboard enrollments:", enrollErr);
        return;
      }


      const courseIds = [...new Set((enrollmentRows || []).map((e) => e.course_id))];

      if (courseIds.length === 0) {
        setQuickStats([
          { ...defaultQuickStats[0], value: 0 },
          { ...defaultQuickStats[1], value: 0 },
          { ...defaultQuickStats[2], value: "0%" },
        ]);
        setAttendanceTrend({
          labels: ["—"],
          datasets: [{ data: [0], strokeWidth: 3 }],
        });
        setAttendancePie([
          { name: "—", attendance: 0, color: "#e5e7eb" },
        ]);
        setTableData([]);
        return;
      }

      const { data: courseRows, error: coursesErr } = await supabase
        .from("courses")
        .select("id, course_code, course_name")
        .in("id", courseIds);

      if (coursesErr) {
        console.error("Student dashboard courses:", coursesErr);
        return;
      }

      const courses = courseRows || [];
      const courseMeta = new Map(
        courses.map((c) => [
          c.id,
          { code: c.course_code, name: c.course_name, label: c.course_code || c.course_name },
        ])
      );

      const { data: scheduleRows, error: schErr } = await supabase
        .from("schedules")
        .select("id, course_id")
        .in("course_id", courseIds);

      if (schErr) {
        console.error("Student dashboard schedules:", schErr);
        return;
      }

      const schedules = scheduleRows || [];
      const scheduleIds = schedules.map((s) => s.id);
      const scheduleToCourse = new Map(schedules.map((s) => [s.id, s.course_id]));

      const totalByCourse = new Map<string, number>();
      for (const s of schedules) {
        totalByCourse.set(s.course_id, (totalByCourse.get(s.course_id) || 0) + 1);
      }

      const attendedByCourse = new Map<string, number>();
      let totalAttended = 0;

      if (scheduleIds.length > 0) {
        const { data: attRows, error: attErr } = await supabase
          .from("attendance")
          .select("schedule_id")
          .eq("student_id", studentId)
          .in("schedule_id", scheduleIds);

        if (attErr) {
          console.error("Student dashboard attendance:", attErr);
          return;
        }

        for (const row of attRows || []) {
          const cid = scheduleToCourse.get(row.schedule_id);
          if (!cid) continue;
          attendedByCourse.set(cid, (attendedByCourse.get(cid) || 0) + 1);
          totalAttended += 1;
        }
      }

      const enrolledCount = courseIds.length;
      const totalSessions = schedules.length;
      const overallPct =
        totalSessions <= 0 ? 0 : clampPercent((totalAttended / totalSessions) * 100);

      setQuickStats([
        {
          id: "1",
          title: "Enrolled courses",
          value: enrolledCount,
          icon: "school-outline",
          color: "#fb923c",
        },
        {
          id: "2",
          title: "Attended",
          value: totalAttended,
          icon: "checkmark-done-circle-outline",
          color: "#16a34a",
        },
        {
          id: "3",
          title: "Score",
          value: `${overallPct}%`,
          icon: "trophy-outline",
          color: "#6366f1",
        },
      ]);

      const ordered = courseIds
        .map((id) => {
          const meta = courseMeta.get(id);
          const total = totalByCourse.get(id) || 0;
          const attended = attendedByCourse.get(id) || 0;
          const pct = total <= 0 ? 0 : clampPercent((attended / total) * 100);
          return {
            courseId: id,
            label: meta?.label ?? "—",
            total,
            attended,
            pct,
          };
        })
        .sort((a, b) => a.label.localeCompare(b.label));

      const labels = ordered.map((o) =>
        o.label.length > 10 ? `${o.label.slice(0, 9)}…` : o.label
      );
      const percents = ordered.map((o) => o.pct);

      if (labels.length === 0) {
        setAttendanceTrend({
          labels: ["—"],
          datasets: [{ data: [0], strokeWidth: 3 }],
        });
      } else {
        setAttendanceTrend({
          labels,
          datasets: [{ data: percents, strokeWidth: 3 }],
        });
      }

      const pieSlices: PieSlice[] = ordered.map((o, idx) => ({
        name: o.label.length > 12 ? `${o.label.slice(0, 11)}…` : o.label,
        attendance: o.pct,
        color: PIE_COLORS[idx % PIE_COLORS.length],
      }));

      setAttendancePie(
        pieSlices.length > 0
          ? pieSlices
          : [{ name: "—", attendance: 0, color: "#e5e7eb" }]
      );

      setTableData(
        ordered.map((o) => ({
          unit: courseMeta.get(o.courseId)?.name ?? o.label,
          total: o.total,
          attended: o.attended,
        }))
      );
    } catch (e) {
      console.error("Student dashboard fetch failed:", e);
    } finally {
      if (showLoading) setLoading(false);
      setRefreshing(false);
    }
  },
    [studentId]
  );

  useEffect(() => {
    fetchDashboard({ showLoading: true });
  }, [fetchDashboard]);

  const onRefresh = useCallback(async () => {
    await fetchDashboard({ showLoading: false });
  }, [fetchDashboard]);

  const pieChartData = useMemo(() => {
    return attendancePie.map((p) => ({
      ...p,
      population: Math.max(1, p.attendance),
      legendFontColor: "#333",
      legendFontSize: 12,
    }));
  }, [attendancePie]);

  return (
    <SafeAreaView
      edges={["left", "right"]}
      className="flex-1 bg-gray-100 relative"
    >
      {/* ===== Header ===== */}
      <CustomHeader title="Dashboard" />

      {loading ? (
        <StudentDashboardSkeleton />
      ) : (
        <ScrollView
          contentContainerClassName="pb-10"
          refreshControl={
            <CustomRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
        {/* ===== Stats ===== */}
        <View className="flex-row flex-wrap justify-between px-4 mt-4">
          {quickStats.map((item) => (
            <View
              key={item.id}
              className="bg-white rounded-lg shadow-md mb-4 items-center py-4"
              style={{ width: (screenWidth - 48) / 3 }}
            >
              <View
                className="rounded-full p-2 mb-2"
                style={{ backgroundColor: item.color + "20" }}
              >
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={item.color}
                />
              </View>
              <Text className="text-lg font-bold" style={{ color: item.color }}>
                {item.value}
              </Text>
              <Text className="text-xs text-gray-600">{item.title}</Text>
            </View>
          ))}
        </View>

        {/* ===== Line Chart ===== */}
        <View className="px-4 mt-2">
          <Text className="text-gray-700 font-bold mb-2">Attendance Trend</Text>
          <View className="bg-white rounded-xl p-2 shadow">
            <LineChart
              data={attendanceTrend}
              width={screenWidth - 32}
              height={220}
              yAxisSuffix="%"
              chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                color: (opacity = 1) => `rgba(99, 102, 241,${opacity})`,
                labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                propsForDots: { r: "5", strokeWidth: "0", stroke: "#3b82f6" },
              }}
              bezier
              style={{ borderRadius: 12 }}
            />
          </View>
        </View>

        {/* ===== Pie Chart ===== */}
        <View className="px-4 mt-4">
          <Text className="text-gray-700 font-bold mb-2">
            Attendance by Course
          </Text>
          <View className="bg-white rounded-xl p-2 shadow items-center">
            <PieChart
              data={pieChartData}
              width={screenWidth - 32}
              height={200}
              chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </View>

        {/* ===== Table ===== */}
        <View className="px-4 mt-4">
          <Text className="text-gray-700 font-bold mb-2">
            Detailed Attendance
          </Text>
          <View className="bg-white rounded-xl shadow overflow-hidden">
            <View className="flex-row bg-green-600/20 px-3 py-2">
              <Text className="flex-1 font-semibold text-gray-700">Unit</Text>
              <Text className="w-16 text-center font-semibold text-gray-700">
                Total
              </Text>
              <Text className="w-20 text-center font-semibold text-gray-700">
                Attended
              </Text>
            </View>
            {tableData.map((row, idx) => (
              <View
                key={`${row.unit}-${idx}`}
                className={`flex-row px-3 py-2 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <Text className="flex-1 text-gray-700">{row.unit}</Text>
                <Text className="w-16 text-center text-gray-700">
                  {row.total}
                </Text>
                <Text className="w-20 text-center text-gray-700">
                  {row.attended}
                </Text>
              </View>
            ))}
          </View>
        </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
