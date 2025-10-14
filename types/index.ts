export interface SignupForm {
  name: string;
  email: string;
  password: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export type ScheduleForm = {
  course: string;
  startTime: string;
  endTime: string;
  venue: string;
  instructorId?: string;
  instructions?: string;
};

export interface AddCourseForm {
  course_name: string;
  course_code: string;
}

export interface StudentSchedule {
  enrollmentId: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  scheduleId: string;
  startTime: string;
  endTime: string;
  venue: string;
}
