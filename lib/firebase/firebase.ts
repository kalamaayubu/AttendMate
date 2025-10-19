// Purpose: Request user for notification permission, if permitted, get the FCM token
import messaging from "@react-native-firebase/messaging";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Alert, Linking, Platform } from "react-native";
import { getFirebaseApp } from "./firebaseInit";

export async function requestPermissionsAndGetToken() {
  // Initialize Firebase if not already done
  getFirebaseApp();

  // Give a warning if not on a real device
  if (!Device.isDevice) {
    console.warn("Must use physical device for Push Notifications");
    return;
  }

  // 1. Request permissions to receive notifications
  console.log("🔔 Requesting notification permissions...");
  const { status, canAskAgain } = await Notifications.requestPermissionsAsync();
  console.log("Notification permission status:", status);
  console.log("🔔 Can ask again?:", canAskAgain);

  if (status !== "granted") {
    console.warn("Push Notification permission denied");

    // 👇 Add this
    if (!canAskAgain) {
      console.log(
        "🔧 Opening app settings for user to enable notifications..."
      );

      Alert.alert(
        "Enable Notifications",
        "Turn on AttendMate notifications in settings to stay updated.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
    }

    return null;
  }

  // 2. Get the device/FCM token
  const fcmToken = await messaging().getToken();
  console.log("FCM Token:", fcmToken);

  // 3. Android notification channel setup(for local/foreground notifications)
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return fcmToken;
}
