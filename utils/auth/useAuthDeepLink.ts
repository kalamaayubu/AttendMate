import { supabase } from "@/lib/supabase";
import * as Linking from "expo-linking"; // Handles deep links in Expo
import { useEffect } from "react";
import { redirectBasedOnRole } from "./redirectBasedOnRole";

/**
 * Hook to listen for deep links that contain auth info
 * (e.g. user clicks email verification link).
 */
export function useAuthDeepLink() {
  useEffect(() => {
    // Listen for links while the app is already open
    const sub = Linking.addEventListener("url", async ({ url }) => {
      console.log("Deep link received:", url);
      await handleAuthLink(url);
    });

    // Also handle the case where the app was launched by a deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log("Launched by link:", url);
        handleAuthLink(url);
      }
    });

    // Clean up the listener when the component unmounts
    return () => sub.remove();
  }, []);
}

/**
 * Processes the deep link URL to extract the auth code or tokens
 * and exchanges them for a valid Supabase session.
 */
async function handleAuthLink(url: string) {
  const parsed = new URL(url);
  let code = parsed.searchParams.get("code"); // Get ?code=… from the URL

  try {
    // If there's no code, check if tokens are in the URL hash (OAuth flow)
    if (!code && parsed.hash) {
      const params = new URLSearchParams(parsed.hash.replace("#", ""));
      const at = params.get("access_token");
      const rt = params.get("refresh_token");

      // If both tokens exist, set the session directly
      if (at && rt) {
        await supabase.auth.setSession({ access_token: at, refresh_token: rt });
        await redirectBasedOnRole(); // Redirect based on role
      }
    }

    // If still no code, nothing to do
    if (!code) {
      console.warn("No code found in link.");
      return;
    }

    // Exchange the code for a Supabase session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;

    console.log("Session established:", data.session);
    await redirectBasedOnRole(); // Redirect based on role
  } catch (err: any) {
    console.error("Auth link handling failed:", err.message);
    alert("Sign-in failed, please try again."); // Notify the user of an error
  }
}
