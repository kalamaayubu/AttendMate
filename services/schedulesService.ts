import { supabase } from "@/lib/supabase";
import { ScheduleForm } from "@/types";

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
};
