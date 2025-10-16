// Purpose: Save the FCM token, Configure the notification behaviours(Logical and appearance behaviour)
import { notificationServices } from "@/services/notificationServices";
import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { requestPermissionsAndGetToken } from "./firebase";
import { getFirebaseApp } from "./firebaseInit";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function NotificationPermissionHandler() {
  getFirebaseApp(); // Initialize Firebase before using messaging

  useEffect(() => {
    (async () => {
      const token = await requestPermissionsAndGetToken();
      if (token) {
        // Send token to the backend
        await notificationServices.saveToken(token);
      }
    })(); // Invoke the async function immediately: ()

    // Foreground: FCM receives message -> display notification via expo-notifications
    const unsubscribeOnMessage = messaging().onMessage(
      async (remoteMessage) => {
        console.log("FCM foreground message", remoteMessage);
        await Notifications.scheduleNotificationAsync({
          content: {
            title:
              remoteMessage.notification?.title ?? remoteMessage.data?.title,
            body: remoteMessage.notification?.body ?? remoteMessage.data?.body,
            data: remoteMessage.data ?? {},
          },
          trigger: null,
        });
      }
    );

    // When user taps the notification (app in background or closed), handle navigation
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        console.log("Notification tapped, data:", data);
        // Navigate the appropriate screen
      });

    // Background message handler registration
    return () => {
      unsubscribeOnMessage();
      responseListener.remove();
    };
  }, []);
  return null; // No UI just cool logic
}
