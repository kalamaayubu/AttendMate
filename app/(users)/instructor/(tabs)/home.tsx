import CustomHeader from "../../../../components/general/CustomHeader";
import CustomRefreshControl from "../../../../components/general/RefreshControl";
import CourseAttendanceSummaryTable from "../../../../components/instructor/CourseAttendanceSummaryTable";
import InstructorLineChart from "../../../../components/instructor/InstructorLineChart";
import InstructorPieChart from "../../../../components/instructor/InstructorPieChart";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Dimensions, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { coursesService } from "../../../../services/coursesService";
import { supabase } from "../../../../lib/supabase";

const screenWidth = Dimensions.get("window").width;

const MONTH_LABELS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const COURSE_COLORS = [
  "#16a34a",
  "#f97316",
  "#3B82F6",
  "#D946EF",
  "#22c55e",
  "#6366f1",
];

type CourseRow = {
  id: string;
  name: string;
};

type ScheduleRow = {
  id: string;
  course_id: string;
  start_time: string;
};

type EnrollmentRow = {
  course_id: string;
  student_id: string;
};

type AttendanceRow = {
  schedule_id: string;
  student_id: string;
};

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

export default function InstructorDashboard() {
  const instructor = useSelector((state: RootState) => state?.user.user);
  const instructorId = instructor?.id;

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lineChartData, setLineChartData] = useState<any>(() => ({
    labels: MONTH_LABELS,
    datasets: [{ data: Array(12).fill(0), color: () => "#16a34a", strokeWidth: 3 }],
  }));

  const [pieChartData, setPieChartData] = useState<any[]>([]);
  const [coursesAttendance, setCoursesAttendance] = useState<
    { name: string; attendance: number; color: string }[]
  >([]);

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const [quickStats, setQuickStats] = useState<
    { id: string; title: string; value: string | number; icon: any; color: string }[]
  >([
    { id: "1", title: "My Courses", value: 0, icon: "book-outline", color: "#16a34a" },
    { id: "2", title: "Attendance", value: "0%", icon: "checkmark-done-outline", color: "#fb923c" },
    { id: "3", title: "Scheduled", value: 0, icon: "calendar-outline", color: "#6366f1" },
  ]);

  const fetchInstructorDashboard = useCallback(
    async (opts?: { showLoading?: boolean }) => {
      if (!instructorId) {
        setRefreshing(false);
        return;
      }

      const showLoading = opts?.showLoading ?? false;
      if (showLoading) setLoading(true);
      else setRefreshing(true);

      try {
        const { success, data: courses } = await coursesService.getInstructorCourses(
          instructorId
        );
        const instructorCourses = (success ? courses : []) as CourseRow[];
        const courseIds = instructorCourses.map((c) => c.id);

        if (courseIds.length === 0) {
          setPieChartData([]);
          setCoursesAttendance([]);
          setLineChartData({
            labels: MONTH_LABELS,
            datasets: [
              { data: Array(12).fill(0), color: () => "#16a34a", strokeWidth: 3 },
            ],
          });
          setQuickStats([
            {
              id: "1",
              title: "My Courses",
              value: 0,
              icon: "book-outline",
              color: "#16a34a",
            },
            {
              id: "2",
              title: "Attendance",
              value: "0%",
              icon: "checkmark-done-outline",
              color: "#fb923c",
            },
            {
              id: "3",
              title: "Scheduled",
              value: 0,
              icon: "calendar-outline",
              color: "#6366f1",
            },
          ]);
          return;
        }

        // 1) Schedules (for charts + table)
        const { data: schedules, error: schedulesError } = await supabase
          .from("schedules")
          .select("id, course_id, start_time")
          .eq("instructor_id", instructorId)
          .in("course_id", courseIds)
          ;

        if (schedulesError) {
          console.error("Error loading schedules:", schedulesError);
          return;
        }

        const scheduleRows = (schedules || []) as ScheduleRow[];
        const scheduleIds = scheduleRows.map((s) => s.id);

        const parseUtcYear = (iso: string) => {
          const t = Date.parse(iso);
          if (!Number.isFinite(t)) return null;
          return new Date(t).getUTCFullYear();
        };

        // We'll decide the chart year after fetching attendance rows (so we pick a year with data).
        let chartYear: number = currentYear;

        // 2) Enrollments for expected attendance counts
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from("enrollments")
          .select("course_id, student_id")
          .in("course_id", courseIds);

        if (enrollmentsError) {
          console.error("Error loading enrollments:", enrollmentsError);
          return;
        }

        const enrollmentRows = (enrollments || []) as EnrollmentRow[];

        const enrollCountByCourse = new Map<string, number>();
        for (const e of enrollmentRows) {
          enrollCountByCourse.set(
            e.course_id,
            (enrollCountByCourse.get(e.course_id) || 0) + 1
          );
        }

        // 3) Attendance for actual counts
        let attendanceRows: AttendanceRow[] = [];
        if (scheduleIds.length > 0) {
          const { data: attendance, error: attendanceError } = await supabase
            .from("attendance")
            .select("schedule_id, student_id")
            .in("schedule_id", scheduleIds);

          if (attendanceError) {
            console.error("Error loading attendance:", attendanceError);
            return;
          }

          attendanceRows = (attendance || []) as AttendanceRow[];
        }

        // Pick the latest year that actually has attendance records, otherwise fall back to the latest schedule year.
        const attendanceScheduleIds = new Set(attendanceRows.map((a) => a.schedule_id));
        const attendanceYearCandidates = scheduleRows
          .filter((s) => attendanceScheduleIds.has(s.id))
          .map((s) => parseUtcYear(s.start_time))
          .filter((y): y is number => typeof y === "number" && Number.isFinite(y));

        if (attendanceYearCandidates.length > 0) {
          chartYear = Math.max(...attendanceYearCandidates);
        } else {
          const scheduleYearCandidates = scheduleRows
            .map((s) => parseUtcYear(s.start_time))
            .filter(
              (y): y is number => typeof y === "number" && Number.isFinite(y)
            );
          chartYear =
            scheduleYearCandidates.length > 0
              ? Math.max(...scheduleYearCandidates)
              : currentYear;
        }

        // Monthly attendance rate (Line Chart)
        const expectedPerMonth = Array(12).fill(0);
        const actualPerMonth = Array(12).fill(0);
        const scheduleIdToMonth = new Map<string, number>();

        for (const sch of scheduleRows) {
          const t = Date.parse(sch.start_time);
          if (!Number.isFinite(t)) continue;
          const d = new Date(t);
          const y = d.getUTCFullYear();
          if (y !== chartYear) continue; // Line chart: latest year with data only
          const m = d.getUTCMonth(); // 0-11
          if (!Number.isFinite(m)) continue;
          scheduleIdToMonth.set(sch.id, m);

          expectedPerMonth[m] += enrollCountByCourse.get(sch.course_id) || 0;
        }

        for (const att of attendanceRows) {
          const m = scheduleIdToMonth.get(att.schedule_id);
          if (m === undefined) continue;
          actualPerMonth[m] += 1;
        }

        const monthlyPercents = expectedPerMonth.map((expected, idx) => {
          if (expected <= 0) return 0;
          const pct = (actualPerMonth[idx] / expected) * 100;
          return Math.round(clampPercent(pct));
        });

        setLineChartData({
          labels: MONTH_LABELS,
          datasets: [
            { data: monthlyPercents, color: () => "#16a34a", strokeWidth: 3 },
          ],
        });

        // Course attendance rate (Pie Chart + Table)
        const scheduleCountByCourse = new Map<string, number>();
        const scheduleIdToCourse = new Map<string, string>();
        for (const sch of scheduleRows) {
          scheduleIdToCourse.set(sch.id, sch.course_id);
          scheduleCountByCourse.set(
            sch.course_id,
            (scheduleCountByCourse.get(sch.course_id) || 0) + 1
          );
        }

        const actualCountByCourse = new Map<string, number>();
        for (const att of attendanceRows) {
          const courseId = scheduleIdToCourse.get(att.schedule_id);
          if (!courseId) continue;
          actualCountByCourse.set(courseId, (actualCountByCourse.get(courseId) || 0) + 1);
        }

        const coursesAttendanceRows = instructorCourses.map((course, idx) => {
          const enrollCount = enrollCountByCourse.get(course.id) || 0;
          const scheduleCount = scheduleCountByCourse.get(course.id) || 0;
          const expected = scheduleCount * enrollCount;
          const actual = actualCountByCourse.get(course.id) || 0;
          const pct = expected <= 0 ? 0 : (actual / expected) * 100;

          return {
            name: course.name,
            attendance: Math.round(clampPercent(pct)),
            color: COURSE_COLORS[idx % COURSE_COLORS.length],
          };
        });

        setCoursesAttendance(coursesAttendanceRows);
        setPieChartData(
          coursesAttendanceRows.map((c) => ({
            name: c.name,
            population: c.attendance,
            color: c.color,
            legendFontColor: "#333",
            legendFontSize: 12,
          }))
        );

        // Quick stats derived from the same dataset (no extra dummy values)
        const expectedTotal = expectedPerMonth.reduce((sum, v) => sum + v, 0);
        const actualTotal = actualPerMonth.reduce((sum, v) => sum + v, 0);
        const overallPct = expectedTotal <= 0 ? 0 : (actualTotal / expectedTotal) * 100;

        // "Scheduled" card: show total sessions in the chart year (avoids zero when you don't have future schedules).
        const scheduledUpcoming = scheduleRows.filter(
          (s) => {
            const t = Date.parse(s.start_time);
            if (!Number.isFinite(t)) return false;
            return new Date(t).getUTCFullYear() === chartYear;
          }
        ).length;

        setQuickStats([
          {
            id: "1",
            title: "My Courses",
            value: instructorCourses.length,
            icon: "book-outline",
            color: "#16a34a",
          },
          {
            id: "2",
            title: "Attendance",
            value: `${Math.round(clampPercent(overallPct))}%`,
            icon: "checkmark-done-outline",
            color: "#fb923c",
          },
          {
            id: "3",
            title: "Scheduled",
            value: scheduledUpcoming,
            icon: "calendar-outline",
            color: "#6366f1",
          },
        ]);
      } catch (err) {
        console.error("Instructor dashboard fetch failed:", err);
      } finally {
        if (showLoading) setLoading(false);
        setRefreshing(false);
      }
    },
    [instructorId, currentYear]
  );

  useEffect(() => {
    fetchInstructorDashboard({ showLoading: true });
  }, [fetchInstructorDashboard]);

  const onRefresh = useCallback(async () => {
    await fetchInstructorDashboard({ showLoading: false });
  }, [fetchInstructorDashboard]);

  return (
    <SafeAreaView
      edges={["left", "right"]}
      className="flex-1 bg-gray-100 relative"
    >
      {loading ? (
        <View className="flex-1 justify-center items-center bg-gray-100">
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <>
          {/* ===== Header ===== */}
          <CustomHeader title="Dashboard" />

          <ScrollView
            contentContainerClassName="pb-10"
            refreshControl={
              <CustomRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {/* ===== Quick Stats ===== */}
            <View className="flex-row flex-wrap justify-between px-4 mt-4">
              {quickStats.map((item) => (
                <View
                  key={item.id}
                  className="bg-white rounded-lg shadow-md mb-4 items-center py-4"
                  style={{ width: (screenWidth - 48) / 3 }}
                >
                  <View
                    className="rounded-full p-3 mb-2"
                    style={{ backgroundColor: item.color + "20" }}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={24}
                      color={item.color}
                    />
                  </View>
                  <Text
                    style={{ color: item.color }}
                    className="text-lg font-bold"
                  >
                    {item.value}
                  </Text>
                  <Text className="text-xs text-gray-600">{item.title}</Text>
                </View>
              ))}
            </View>

            <InstructorLineChart
              width={screenWidth - 32}
              data={lineChartData}
            />
            <InstructorPieChart width={screenWidth - 32} data={pieChartData} />
            <CourseAttendanceSummaryTable
              rows={coursesAttendance}
            />
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}
