import { supabase } from "@/lib/supabase";
import { ScheduleForm, StudentSchedule } from "@/types";

interface Schedule {
  id: string;
  start_time: string;
  end_time: string;
  venue: string;
}

interface Course {
  id: string;
  course_code: string;
  course_name: string;
  schedules?: Schedule[];
}

interface Enrollment {
  id: string;
  course_id: string;
  courses: Course;
}

interface FormattedSchedule {
  id: string;
  course: string;
  time: string;
  location: string;
}

export const schedulesService = {
  // Instructor: Adding a new schedule
  async addSchedule(schedule: ScheduleForm) {
    console.log("ADDING SCHEDULE:", schedule);
    try {
      const { data, error } = await supabase.from("schedules").insert([
        {
          course_id: schedule.course,
          start_time: schedule.startTime,
          end_time: schedule.endTime,
          venue: schedule.venue,
          instructor_id: schedule.instructorId,
          instructions: schedule.instructions,
        },
      ]);

      if (error) {
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }

      return {
        success: true,
        message: "Schedule added successfully.",
        data,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || "Unexpected error occurred.",
        data: null,
      };
    }
  },

  // Student: Fetching schedules
  async getSchedules(studentId: string) {
    try {
      const { data, error } = await supabase
        .from("enrollments")
        .select(
          `
            id,
            courses!inner (
              id,
              course_name,
              course_code,
              schedules!inner (
                id,
                start_time,
                end_time,
                venue
              )
            )
          `
        )
        .eq("student_id", studentId);

      if (error) {
        console.log("ERROR FETCHING SCHEDULES:", error);
        return {
          success: false,
          error: error.message,
          data: [],
        };
      }
      console.log("NEW SCHEDULES:", JSON.stringify(data, null, 2));

      // Flatten data and format cleanly
      const flattenSchedules = (data: any[]): StudentSchedule[] => {
        return data.flatMap((enrollment) => {
          const { id: enrollmentId, courses } = enrollment;
          const {
            id: courseId,
            course_name: courseName,
            course_code: courseCode,
            schedules,
          } = courses;

          console.log("ENROLLMENT:", enrollment);
          console.log("COURSES:", courses);

          return (schedules || []).map((schedule: any) => ({
            enrollmentId,
            courseId,
            courseCode,
            courseName,
            scheduleId: schedule.id,
            startTime: schedule.start_time,
            endTime: schedule.end_time,
            venue: schedule.venue,
          }));
        });
      };

      console.log("FLATTENDATA:", flattenSchedules(data));
      const formattedSchedules = flattenSchedules(data || []);
      return {
        success: true,
        data: formattedSchedules,
      };
    } catch (err: any) {
      console.log("EXCEPTION FETCHING SCHEDULES:", err);
      return {
        success: false,
        error: err.message || "Unexpected error occurred.",
        data: [],
      };
    }
  },
};
