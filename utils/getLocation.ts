import * as Location from "expo-location";

/**
 * Gets the current device location permission handling.
 * Returns an object { latitude, longitude } or null if permission denied
 */

import Toast from "react-native-toast-message";

export async function getCurrentLocation() {
  try {
    // Ask for location permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permission denied",
        text2: "Location access is required to perform this action.",
      });
      return null;
    }

    // Get current position
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    // Extract the coordinates from location
    const coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    return coords; // Return the location coordinates
  } catch (error: any) {
    console.error("Error getting location:", error);
    Toast.show({
      type: "error",
      text1: "Location error",
      text2: error.message || "Failed to get current location.",
    });
    return null;
  }
}
