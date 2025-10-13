import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
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
    Toast.show({
      type: "error",
      text1: "Role Not Found",
      text2: "Failed to determine role. Please log in again.",
    });
    console.error("User role not found for ID:", userId);
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
