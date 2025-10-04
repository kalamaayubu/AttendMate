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
  startTime: Date | null;
  endTime: Date | null;
  venue: string;
  directions?: string;
};
