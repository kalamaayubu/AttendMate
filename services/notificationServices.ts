import { supabase } from "@/lib/supabase";

export const notificationServices = {
  // Save FCM token to Supabase
  async saveToken(token: string, userId: string) {
    console.log("Saving FCM token for user:", userId);
    const { data, error } = await supabase
      .from("profiles")
      .update({ device_id: token })
      .eq("id", userId)
      .select();

    if (error) {
      console.error("Error storing FCM token:", error);
      return { success: false, error: error.message, data: null };
    }

    console.log("FCM token stored successfully:", data);
    return { success: true, error: null, data };
  },
};
