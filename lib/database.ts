// import * as SQLite from "expo-sqlite";

// // Open (or create) the database file
// export const db = (SQLite as any).openDatabase("attendmate.db");

// // Function to create all tables
// export const setupDatabase = () => {
//   db.transaction((tx: any) => {
//     // Enable foreign keys
//     tx.executeSql(`PRAGMA foreign_keys = ON;`);

//     // 1️⃣ profiles
//     tx.executeSql(`
//       CREATE TABLE IF NOT EXISTS profiles (
//         id TEXT PRIMARY KEY,
//         role TEXT NOT NULL CHECK(role IN ('student','instructor','admin')),
//         first_name TEXT NOT NULL,
//         last_name TEXT NOT NULL,
//         email TEXT NOT NULL UNIQUE,
//         phone TEXT
//       );
//     `);

//     // 2️⃣ instructors
//     tx.executeSql(`
//       CREATE TABLE IF NOT EXISTS instructors (
//         id TEXT PRIMARY KEY,
//         FOREIGN KEY(id) REFERENCES profiles(id) ON DELETE CASCADE
//       );
//     `);

//     // 3️⃣ students
//     tx.executeSql(`
//       CREATE TABLE IF NOT EXISTS students (
//         id TEXT PRIMARY KEY,
//         reg_no TEXT NOT NULL UNIQUE,
//         FOREIGN KEY(id) REFERENCES profiles(id) ON DELETE CASCADE
//       );
//     `);

//     // 4️⃣ admin
//     tx.executeSql(`
//       CREATE TABLE IF NOT EXISTS admin (
//         admin_id TEXT PRIMARY KEY,
//         FOREIGN KEY(admin_id) REFERENCES profiles(id) ON DELETE CASCADE
//       );
//     `);

//     // 5️⃣ courses
//     tx.executeSql(`
//       CREATE TABLE IF NOT EXISTS courses (
//         id TEXT PRIMARY KEY,
//         course_code TEXT NOT NULL UNIQUE,
//         course_name TEXT NOT NULL
//       );
//     `);

//     // 6️⃣ instructor_courses
//     tx.executeSql(`
//       CREATE TABLE IF NOT EXISTS instructor_courses (
//         id TEXT PRIMARY KEY,
//         instructor_id TEXT,
//         course_id TEXT,
//         FOREIGN KEY(instructor_id) REFERENCES instructors(id) ON DELETE CASCADE,
//         FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
//       );
//     `);

//     // 7️⃣ enrollments
//     tx.executeSql(`
//       CREATE TABLE IF NOT EXISTS enrollments (
//         id TEXT PRIMARY KEY,
//         student_id TEXT,
//         course_id TEXT,
//         enrolled_at TEXT DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
//         FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
//       );
//     `);

//     // 8️⃣ schedules
//     tx.executeSql(`
//       CREATE TABLE IF NOT EXISTS schedules (
//         id TEXT PRIMARY KEY,
//         course_id TEXT,
//         instructor_id TEXT,
//         start_time TEXT NOT NULL,
//         end_time TEXT NOT NULL,
//         latitude REAL,
//         longitude REAL,
//         FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE,
//         FOREIGN KEY(instructor_id) REFERENCES instructors(id) ON DELETE CASCADE
//       );
//     `);

//     // 9️⃣ attendance
//     tx.executeSql(`
//       CREATE TABLE IF NOT EXISTS attendance (
//         id TEXT PRIMARY KEY,
//         schedule_id TEXT,
//         student_id TEXT,
//         attend_time TEXT DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY(schedule_id) REFERENCES schedules(id),
//         FOREIGN KEY(student_id) REFERENCES students(id)
//       );
//     `);

//     // DEBUGGING LOGS
//     // tx.executeSql(
//     //   "SELECT * FROM students;",
//     //   [],
//     //   (_: any, { rows }: { rows: any }) =>
//     //     console.log("Students (after setup):", rows),
//     //   (_: any, error: any) => console.error("Error fetching students:", error)
//     // );
//   });
// };
