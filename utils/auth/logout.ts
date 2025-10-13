import { supabase } from "@/lib/supabase";
import { store } from "@/redux/store";
import { clearUser } from "@/redux/userSlice";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

/**
 * Logs the user out of Supabase and redirects them to the auth screen.
 */
export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error.message);
      Toast.show({
        type: "error",
        text1: "Logout Failed",
        text2: error.message,
      });
      return;
    }

    store.dispatch(clearUser()); // Clear redux state

    // Clear navigation stack and go back to auth entry point
    router.replace("/login");
    console.log("User logged out successfully.");
  } catch (err: any) {
    console.error("Unexpected error during logout:", err.message);
    Toast.show({
      type: "error",
      text1: "Logout Failed",
    });
  }
}
