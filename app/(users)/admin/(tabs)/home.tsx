import CustomHeader from "@/components/general/CustomHeader";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AdminCourseDistributionPieCard from "../../../../components/admin/AdminCourseDistributionPieCard";
import AdminGrowthLineChartCard from "../../../../components/admin/AdminGrowthLineChartCard";
import AdminLightCard from "../../../../components/admin/AdminLightCard";
import AdminStatCard from "../../../../components/admin/AdminStatCard";
import { supabase } from "../../../../lib/supabase";

const colorPalette = [
  "#4f46e5", // indigo
  "#f97316", // orange
  "#22c55e", // green
  "#3b82f6",
  "#d946ef",
  "#06b6d4",
];

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [studentsCount, setStudentsCount] = useState(0);
  const [instructorsCount, setInstructorsCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);

  const [growthLabels, setGrowthLabels] = useState<string[]>([]);
  const [growthPoints, setGrowthPoints] = useState<number[]>([]);

  const [coursePieData, setCoursePieData] = useState<
    { name: string; population: number; color: string }[]
  >([]);
  const [topCoursesTableRows, setTopCoursesTableRows] = useState<
    { code: string; name: string; enrollments: number }[]
  >([]);

  const chartRange = useMemo(() => {
    const now = dayjs();
    const from = now.subtract(5, "month").startOf("month");
    const to = now.endOf("month");
    return { from, to };
  }, []);

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        setLoading(true);

        const countOrZero = async (
          table: string,
          selectColumn: string = "id",
        ) => {
          // Prefer server-side count; fall back to array length.
          const res = await supabase
            .from(table)
            .select(selectColumn, { count: "exact", head: true });
          if (res.error) return 0;
          if (typeof res.count === "number") return res.count;
          return 0;
        };

        const [sCount, iCount, cCount, aCount] = await Promise.all([
          countOrZero("students"),
          countOrZero("instructors"),
          countOrZero("courses"),
          countOrZero("admin", "admin_id"),
        ]);

        setStudentsCount(sCount);
        setInstructorsCount(iCount);
        setCoursesCount(cCount);
        setAdminCount(aCount);

        // Growth trend: enrollments per month (last 6 months)
        const fromISO = chartRange.from.toISOString();
        const toISO = chartRange.to.toISOString();
        const { data: enrollmentRows } = await supabase
          .from("enrollments")
          .select("enrolled_at")
          .gte("enrolled_at", fromISO)
          .lte("enrolled_at", toISO);

        const labels: string[] = [];
        const points: number[] = [];
        for (let idx = 0; idx < 6; idx++) {
          const m = chartRange.from.add(idx, "month");
          labels.push(m.format("MMM"));
          points.push(0);
        }

        const monthStartToIndex = new Map<string, number>();
        for (let idx = 0; idx < 6; idx++) {
          const mStart = chartRange.from.add(idx, "month").startOf("month");
          monthStartToIndex.set(mStart.toISOString(), idx);
        }

        (enrollmentRows || []).forEach((row: any) => {
          const d = dayjs(row.enrolled_at);
          const key = d.startOf("month").toISOString();
          const i = monthStartToIndex.get(key);
          if (i !== undefined) points[i] += 1;
        });

        setGrowthLabels(labels);
        setGrowthPoints(points);

        // Course distribution: top courses by enrollments (last 12 months)
        const fromDistISO = dayjs()
          .subtract(12, "month")
          .startOf("month")
          .toISOString();
        const { data: distEnrollments } = await supabase
          .from("enrollments")
          .select("course_id, enrolled_at")
          .gte("enrolled_at", fromDistISO);

        const countsByCourseId = new Map<string, number>();
        (distEnrollments || []).forEach((row: any) => {
          const cid = row.course_id;
          if (!cid) return;
          countsByCourseId.set(cid, (countsByCourseId.get(cid) || 0) + 1);
        });

        const courseIdsSorted = Array.from(countsByCourseId.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([id]) => id);

        let courses: any[] = [];
        if (courseIdsSorted.length > 0) {
          const res = await supabase
            .from("courses")
            .select("id, course_code, course_name")
            .in("id", courseIdsSorted);
          courses = res.data || [];
        } else {
          // Fallback list from DB so dashboard cards/tables still populate with real data.
          const res = await supabase
            .from("courses")
            .select("id, course_code, course_name")
            .limit(6);
          courses = res.data || [];
        }

        const coursesById = new Map<string, any>(
          (courses || []).map((c: any) => [c.id, c]),
        );

        const sourceIds =
          courseIdsSorted.length > 0
            ? courseIdsSorted
            : courses.map((c: any) => c.id);

        const pieData = sourceIds.map((id, idx) => {
          const c = coursesById.get(id);
          // Keep this computed from DB counts; use 1 as visual fallback so the chart stays populated.
          const enrollmentCount = countsByCourseId.get(id) || 0;
          return {
            name: c?.course_code || "Course",
            population: enrollmentCount > 0 ? enrollmentCount : 1,
            color: colorPalette[idx % colorPalette.length],
          };
        });

        setCoursePieData(pieData);

        setTopCoursesTableRows(
          sourceIds.map((id) => {
            const c = coursesById.get(id);
            return {
              code: c?.course_code || "—",
              name: c?.course_name || "—",
              enrollments: countsByCourseId.get(id) || 0,
            };
          }),
        );
      } catch (e) {
        console.error("Admin dashboard fetch failed:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDashboard();
  }, [chartRange]);

  const totalUsers = studentsCount + instructorsCount + adminCount;

  return (
    <SafeAreaView
      edges={["left", "right"]}
      className="flex-1 bg-gray-100 relative"
    >
      <CustomHeader title="Dashboard" />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome */}
        <View className="">
          {/* <Text className="text-gray-900 text-3xl font-semibold">
            {dayjs().hour() < 12
              ? "Good morning,"
              : dayjs().hour() < 18
                ? "Good afternoon,"
                : "Good evening,"}
          </Text> */}

          <Text className="text-gray-800 mt-2 text-xl font-semibold">
            System statistics overview with premium analytics.
          </Text>
        </View>

        {/* Horizontal stats (large cards) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-6 flex flex-row gap-4"
          contentContainerStyle={{ paddingRight: 8 }}
        >
          <AdminStatCard
            title="Total Users"
            value={totalUsers}
            iconName="people-outline"
            tone="indigo"
          />
          <AdminStatCard
            title="Students"
            value={studentsCount}
            iconName="school-outline"
            tone="green"
          />
          <AdminStatCard
            title="Instructors"
            value={instructorsCount}
            iconName="person-outline"
            tone="orange"
          />
          <AdminStatCard
            title="Courses"
            value={coursesCount}
            iconName="book-outline"
            tone="gray"
          />
        </ScrollView>

        {/* Prominent chart (full width) */}
        <View className="mt-6">
          <AdminGrowthLineChartCard
            title="Growth Trend (Enrollments)"
            labels={growthLabels}
            dataPoints={growthPoints}
          />
        </View>

        {/* Secondary chart (full width, below) */}
        <View className="mt-4">
          <AdminCourseDistributionPieCard
            title="Course Distribution"
            data={coursePieData}
          />
        </View>

        {/* Top courses list (cards, not table) */}
        <View className="mt-6">
          <Text className="text-gray-900 font-extrabold text-xl">
            Top Courses
          </Text>
          <Text className="text-gray-600 mt-2">
            Highest enrollments in the last 12 months.
          </Text>

          <View className="mt-4">
            {topCoursesTableRows.map((c, idx) => (
              <View
                key={`${c.code}-${idx}`}
                className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 shadow-sm"
                style={{ elevation: 1 }}
              >
                <View className="flex-row items-center">
                  {/* Image placeholder */}
                  <View
                    className="rounded-2xl bg-indigo-500/10 border border-indigo-500/20"
                    style={{ width: 72, height: 56 }}
                  />
                  <View className="flex-1 ml-4">
                    <Text className="text-gray-900 font-extrabold text-base">
                      {c.code}
                    </Text>
                    <Text
                      className="text-gray-600 font-semibold mt-1"
                      numberOfLines={1}
                    >
                      {c.name}
                    </Text>
                    <View className="flex-row items-center mt-3">
                      <View className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                        <Text className="text-green-700 text-xs font-extrabold">
                          {c.enrollments >= 1000
                            ? `${(c.enrollments / 1000).toFixed(1)}k`
                            : `${c.enrollments}`}{" "}
                          Students
                        </Text>
                      </View>
                      <View className="ml-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
                        <Text className="text-gray-600 text-xs font-extrabold">
                          Rating: N/A
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {loading && (
          <View className="mt-2">
            <AdminLightCard className="p-5">
              <Text className="text-gray-700 font-semibold">
                Loading dashboard...
              </Text>
            </AdminLightCard>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminDashboard;
