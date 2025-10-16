import { supabase } from "@/lib/supabase";

export const notificationServices = {
  // Save FCM token to Supabase
  async saveToken(token: string) {
    const { data, error } = await supabase
      .from("profiles")
      .insert([{ fcm_token: token }])
      .select()
      .single();

    if (error) {
      console.error("Error storing FCM token:", error);
      return { success: false, error: error.message, data: null };
    }

    console.log("FCM token stored successfully:", data);
    return { success: true, error: null, data };
  },
};
