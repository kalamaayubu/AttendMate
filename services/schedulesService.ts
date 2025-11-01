import { sendNotification } from "@/lib/firebase/sendNotification";
import { supabase } from "@/lib/supabase";
import { ScheduleForm, StudentSchedule, StudentScheduleDetails } from "@/types";
import { getCurrentLocation } from "@/utils/getLocation";
import haversine from "haversine-distance";

export const schedulesService = {
  // Instructor: Adding a new schedule
  async addSchedule(schedule: ScheduleForm) {
    // Fetch enrolled students device_id
    const { data: enrolledStudentsTokens, error: enrolledStudentsError } =
      await supabase
        .from("enrollments")
        .select(
          `
              student:students (
                profile:profiles(
                  device_id
                )
              )
            `
        )
        .eq("course_id", schedule.course);

    if (enrolledStudentsError) {
      console.error("Enrolled Student Error:", enrolledStudentsError);
      return { success: false, error: enrolledStudentsError.message };
    }

    // Extract device_ids
    const FCMTokens = enrolledStudentsTokens
      .map((row) => row?.student?.profile?.device_id)
      .filter(Boolean); // Remove nulls

    console.log("FCM tokens to notify:", FCMTokens);

    // Insert schedule
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

      //  Send notification to all recipients
      for (const token of FCMTokens) {
        await sendNotification({
          token,
          title: "New Schedule Added",
          body: `A new schedule for your course has been added.`,
          data: { screen: "notifications" },
        });
      }

      return {
        success: true,
        message: "Schedule created successfully.",
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

  // Instructor: Start session
  async startSession(scheduleId: string, latitude: number, longitude: number) {
    try {
      const { data, error } = await supabase
        .from("schedules")
        .update({ longitude: longitude, latitude: latitude })
        .eq("id", scheduleId);

      if (error) {
        console.error("Error saving location:", error.message);
        return { success: false, error: error.message };
      }

      console.log("Error starting session:", data);
      return { success: true, message: "Session started successfully" };
    } catch (error: any) {
      console.error("Error starting session:", error.message);
      return { success: false, error: error.message };
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

      // Flatten data and format cleanly for the presentation layer
      const flattenSchedules = (data: any[]): StudentSchedule[] => {
        return data.flatMap((enrollment) => {
          const { id: enrollmentId, courses } = enrollment;
          const {
            id: courseId,
            course_name: courseName,
            course_code: courseCode,
            schedules,
          } = courses;

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
  async getScheduleDetailsForStudent(scheduleId: string, studentId: string) {
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
          ),
          attendance (
            id,
            student_id
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
      attendance: data.attendance?.filter((s) => s.student_id === studentId),
    };

    return {
      success: true,
      data: flattened,
    };
  },

  // Student: Compare locatiion to that of the instructor
  async isWithinLocation(scheduleId: string) {
    // Get the location of the instructor
    const { data, error } = await supabase
      .from("schedules")
      .select("latitude, longitude")
      .eq("id", scheduleId)
      .single();

    if (error || !data) {
      console.error("Error fetching venue location");
      return {
        success: false,
        error: error.message || "Could not get location information",
      };
    }

    // Get the location of the student
    const studentLocation = await getCurrentLocation();
    if (!studentLocation) {
      return { success: false, error: "Failed to get your location" };
    }

    // Instructor and student location coordinates
    const instructorCoords = {
      lat: Number(data.latitude),
      lon: Number(data.longitude),
    };
    const studentCoords = {
      lat: Number(studentLocation.latitude),
      lon: Number(studentLocation.longitude),
    };

    // Compute distance between instructor and student using haversine formula
    const distance = haversine(instructorCoords, studentCoords);

    // Check if student is within 25 metres
    const isWithin = distance <= 25;

    if (!isWithin) {
      console.error(
        `🚫 You are not within the venue. Distance: ${distance.toFixed(
          2
        )} meters`
      );
      return { success: false, error: "You are not within the venue" };
    }

    return {
      success: true,
      isWithin,
      distance,
    };
  },

  // Student: Adding attendance
  async markAttendance(studentId: string, scheduleId: string) {
    const { error } = await supabase.from("attendance").insert({
      student_id: studentId,
      schedule_id: scheduleId,
    });

    if (error) {
      console.log("Error marking attendance", error.message);
      return { success: false, error: error.message };
    }

    console.log("Attendance successfully marked");
    return { success: true, message: "Attendance marked successfully!" };
  },
};
