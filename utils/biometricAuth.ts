import * as LocalAuthentication from "expo-local-authentication";

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

    // 2️⃣ Check if biometrics are enrolled (fingerprint or face registered)
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      return {
        success: false,
        message:
          "No biometric credentials found. Please register your fingerprint or face ID first.",
      };
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
        message: "Authentication canceled by user.",
      };
    } else if (result.error === "lockout") {
      return {
        success: false,
        message:
          "Too many failed attempts. Please unlock your device and try again.",
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
