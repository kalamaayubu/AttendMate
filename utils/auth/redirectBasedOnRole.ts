import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { getUserRole } from "./getUserRole";

/**
 * Fetch user role and navigate to the correct dashboard.
 */
export async function redirectBasedOnRole() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    console.warn("No active session found after link handling.");
    return;
  }

  const userId = session.user.id;
  const role = await getUserRole(userId);

  if (!role) {
    alert("Could not determine your role. Please try logging in again.");
    return;
  }

  // Redirect based on role
  switch (role) {
    case "admin":
      router.replace("/admin/home");
      break;
    case "instructor":
      router.replace("/instructor/home");
      break;
    case "student":
      router.replace("/student/home");
      break;
    default:
      console.warn("Unknown role:", role);
      router.replace("/");
      break;
  }
}
