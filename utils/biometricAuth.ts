import * as LocalAuthentication from "expo-local-authentication";
import { Linking, Platform } from "react-native";

export async function requestBiometricPermission() {
  try {
    // 1️⃣ Check if hardware supports biometrics
    const isHardwareSupported = await LocalAuthentication.hasHardwareAsync();
    if (!isHardwareSupported) {
      return {
        success: false,
        message: "Biometric authentication is not supported on this device.",
      };
    }

    // CHECK THE BIOMETRICS SUPPORTED
    const supportedTypes =
      await LocalAuthentication.supportedAuthenticationTypesAsync();

    const supportsFingerprint = supportedTypes.includes(
      LocalAuthentication.AuthenticationType.FINGERPRINT
    );

    const supportsFace = supportedTypes.includes(
      LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
    );

    // 2️⃣ Check if biometrics are enrolled (fingerprint or face registered)
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    console.log(await LocalAuthentication.supportedAuthenticationTypesAsync());
    console.log(await LocalAuthentication.isEnrolledAsync());

    if (!isEnrolled) {
      let msg = "No biometrics enrolled.";

      if (supportsFace && !supportsFingerprint) msg = "Please set up Face ID.";
      if (!supportsFace && supportsFingerprint)
        msg = "Please set up fingerprint.";
      if (supportsFace && supportsFingerprint)
        msg = "Please set up fingerprint or Face ID.";

      return { success: false, message: msg };
    }

    // 3️⃣ Prompt for biometric authentication
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Confirm your identity",
      fallbackLabel: "Use device PIN",
      disableDeviceFallback: true, // disable pin fallback
    });

    if (result.success) {
      return {
        success: true,
        message: "Biometric verification successful!",
      };
    } else if (result.error === "user_cancel") {
      return {
        success: false,
        message: "Could not proceed, you cancelled the authentication.",
      };
    } else if (result.error === "lockout") {
      return {
        success: false,
        message:
          "Too many failed attempts. Please lock your screen, then unlock it and try again.",
      };
    } else {
      return {
        success: false,
        message: "Biometric verification failed. Try again.",
      };
    }
  } catch (error) {
    console.error("Biometric auth error:", error);
    return {
      success: false,
      message: "An unexpected error occurred during biometric authentication.",
    };
  }
}

// Helper function to open biometric registration settings
export function openBiometricSettings() {
  if (Platform.OS === "android") {
    Linking.openSettings();
  } else if (Platform.OS === "ios") {
    Linking.openURL("App-Prefs:root=TOUCHID_PASSCODE");
  }
}
