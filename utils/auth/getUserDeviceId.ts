import { supabase } from "@/lib/supabase";

export async function getUserDeviceId(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("physicalDeviceId")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching DEVICE ID:", error);
    return null;
  }

  return data.physicalDeviceId;
}
