import { sendNotification } from "@/lib/firebase/sendNotification";
import { supabase } from "@/lib/supabase";
import { ScheduleForm, StudentSchedule, StudentScheduleDetails } from "@/types";

export const schedulesService = {
  // Instructor: Adding a new schedule
  async addSchedule(schedule: ScheduleForm) {
    // console.log("ADDING SCHEDULE:", schedule);
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
        console.log("Error scheduling:", error.message);
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }

      // ✅ TEMP: Hardcoded student FCM token (for testing)
      const studentToken =
        "czKuCAedTcSGdIuRoLRzcK:APA91bHh67Vb0sZIUsidTmoFfKdkV_LmEVwYXnh_CE0uc5uD6FiveR1BwltuCWVerXx_RXlTIBOxBX49YaMyZCaEdlYvoxUmis4Rxu6fDl1wPqzJM1FBUDQ";

      // ✅ Send notification
      await sendNotification({
        token: studentToken,
        title: "New Schedule Added",
        body: `A new schedule for your course has been added.`,
        data: {
          screen: "notifications",
        },
      });

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

  // Instructor: Fetch instructor's schedules
  async getMySchedules(instructorId: string) {
    if (!instructorId) return;

    try {
      const { data, error } = await supabase
        .from("schedules")
        .select(
          `
          id,
          start_time,
          end_time,
          venue,
          course: courses(
            id,
            course_code,
            course_name
          )
        `
        )
        .eq("instructor_id", instructorId);

      if (error) {
        console.error("Error fetching instructor schedules");
        return { success: false, error: error.message, data: null };
      }

      return {
        success: true,
        message: "Schedules fetched successfully",
        data: data,
      };
    } catch (error: any) {
      console.error("Error fetching instructor schedules");
      return { success: false, error: error.message, data: null };
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

          // console.log("ENROLLMENT:", enrollment);
          // console.log("COURSES:", courses);

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

  // Student: Fetching schedule details
  async getScheduleDetailsForStudent(scheduleId: string) {
    const { data, error } = await supabase
      .from("schedules")
      .select(
        `
          id,
          start_time,
          end_time,
          venue,
          instructions,
          course: courses (
            id,
            course_name,
            course_code
          ),
          instructor: instructors (
            profile: profiles (
              id, 
              full_name,
              email
            )
          )
        `
      )
      .eq("id", scheduleId)
      .single();

    if (error) {
      console.log("ERROR FETCHING SCHEDULE DETAILS:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    // Grab the first item from the returned arrays (Supabase nests relations as arrays)
    const course = data.course;
    const instructor = data.instructor;

    // Flatten the nested data safely
    const flattened: StudentScheduleDetails = {
      courseId: course?.id,
      courseName: course?.course_name,
      courseCode: course?.course_code,
      scheduleId: data.id,
      startTime: data.start_time,
      endTime: data.end_time,
      venue: data.venue,
      instructions: data.instructions || "Nothing to display here",
      instructorName: instructor?.profile?.full_name,
      instructorEmail: instructor?.profile?.email,
    };

    return {
      success: true,
      data: flattened,
    };
  },
};
