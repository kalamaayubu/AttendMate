import { AddCourseForm, Course, CourseResponse, RawCourseData } from "@/types";
import { supabase } from "../lib/supabase";

export const coursesService = {
  // Admin: Adding a new course
  async addCourse(course: AddCourseForm) {
    try {
      const { data, error } = await supabase
        .from("courses")
        .insert([course])
        .select()
        .single();

      if (error) {
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }

      return {
        success: true,
        message: "Course added successfully.",
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

  // Instructor: Getting all courses they are teaching
  async getInstructorCourses(instructorId: string) {
    try {
      const { data, error } = await supabase
        .from("instructor_courses")
        .select(
          `
          id,
          course_id,
          courses (
            id,
            course_name,
            course_code,
            enrollments (id)
          )
        `
        )
        .eq("instructor_id", instructorId);

      if (error) {
        console.log("Error getting instructor courses", error);
        return { success: false, error: error.message, data: [] };
      }

      const courses =
        data?.map((entry: any) => ({
          id: entry.courses.id,
          code: entry.courses.course_code,
          name: entry.courses.course_name,
          students: entry.courses.enrollments?.length || 0,
        })) || [];

      return { success: true, data: courses };
    } catch (err: any) {
      return { success: false, error: err.message, data: [] };
    }
  },

  // Student: Get enrolled courses
  async getStudentEnrolledCourses(studentId: string) {
    const { data, error } = await supabase
      .from("enrollments")
      .select(
        `
          course: courses(
            id,
            course_code,
            course_name
          )
        `
      )
      .eq("student_id", studentId);

    if (error) {
      console.error("Could not fetch enrolled courses", error.message);
      return { success: false, error: error.message };
    }

    const processCourses = (data: CourseResponse[]): Course[] => {
      return data.map(({ course }) => ({
        id: course.id,
        code: course.course_code,
        name: course.course_name,
      }));
    };

    const formattedData = processCourses(data);

    console.log("ENROLLEDTO:::", JSON.stringify(formattedData, null, 4));
    return { success: true, data: formattedData };
  },

  // Instructor: Get my courses only
  async getMyCoursesOnly(instructorId: string) {
    const { data, error } = await supabase
      .from("instructor_courses")
      .select(
        `
          course:courses (
            id,
            course_code,
            course_name
          )
        `
      )
      .eq("instructor_id", instructorId);

    if (error) {
      console.error("Error getting only instructor courses", error);
      return { success: false, error: error.message, data: [] };
    }

    // Object projection(data extraction)
    const dataProjection = (data as RawCourseData[]).map(
      ({ course }): Course => ({
        id: course.id,
        code: course.course_code,
        name: course.course_name,
      })
    );

    console.log(":::", JSON.stringify(dataProjection, null, 2));
    return { success: true, data: dataProjection };
  },

  // Instructor: Get all courses they are NOT teaching
  async getAllCoursesExceptTaken(instructorId: string) {
    try {
      // Get all courses the instructor is already teaching (reuse existing method)
      const {
        success,
        data: instructorCourses,
        error,
      } = await this.getInstructorCourses(instructorId);

      if (!success)
        throw new Error(error || "Failed to load instructor courses");

      const takenIds = instructorCourses.map((c: any) => c.id);

      // Get all courses except those
      let query = supabase
        .from("courses")
        .select("id, course_name, course_code");

      // Exclude courses the instructor is already teaching
      if (takenIds.length > 0) {
        query = query.not("id", "in", `(${takenIds.join(",")})`);
      }

      // Execute the filtered query to retrieve untaught courses
      const { data, error: coursesError } = await query;
      if (coursesError) throw coursesError;

      const courses =
        data?.map((c) => ({
          id: c.id,
          code: c.course_code,
          name: c.course_name,
        })) || [];

      return { success: true, data: courses };
    } catch (err: any) {
      console.error("Error getting available courses", err);
      return { success: false, error: err.message, data: [] };
    }
  },

  // Instructor: Assigning themselves a course
  async addInstructorCourse(instructorId: string, courseId: string) {
    console.log(`INSTRUCTOR: ${instructorId} COURSE: ${courseId}`);
    try {
      const { data, error } = await supabase
        .from("instructor_courses")
        .insert([{ instructor_id: instructorId, course_id: courseId }])
        .select("course_id");

      if (error) {
        console.error("Error adding instructor course", error.message);
        return { success: false, error: error.message };
      }

      return { success: true, message: "Course added successfully!", data };
    } catch (error: any) {
      console.error("Error adding instructor course", error);
      return { success: false, error: error.message };
    }
  },
};
