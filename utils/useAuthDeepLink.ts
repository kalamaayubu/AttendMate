// Purpose: Listen for verification links, exchange it for a session, and redirect user into the app

import { supabase } from "@/lib/supabase";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useEffect } from "react";

export function useAuthDeepLink() {
  useEffect(() => {
    const sub = Linking.addEventListener("url", async ({ url }) => {
      console.log("Deep link received:", url);
      const { data, error } = await supabase.auth.exchangeCodeForSession(url);
      if (error) {
        console.error("Auth exchange error:", error.message, error);
        alert("Something went wrong signing you in. Check the logs.");
      } else {
        console.log("Session established:", data.session);
        router.replace("/instructor/home");
      }
    });

    return () => sub.remove();
  }, []);
}
