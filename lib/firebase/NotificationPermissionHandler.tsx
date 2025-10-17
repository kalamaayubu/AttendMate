// Purpose: Save the FCM token, Configure the notification behaviours(Logical and appearance behaviour)
import { RootState } from "@/redux/store";
import { notificationServices } from "@/services/notificationServices";
import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { requestPermissionsAndGetToken } from "./firebase";
import { getFirebaseApp } from "./firebaseInit";

// Configure how notifications are handled when received in the foreground
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
  // Get logged in user from Redux store
  const { user } = useSelector((state: RootState) => state.user);

  // Initialize Firebase(only once)
  getFirebaseApp();

  useEffect(() => {
    console.log("USER IN NOTIFICATION HANDLER:", user);
    // Only register for notifications if user is logged in
    if (!user?.id) return;

    (async () => {
      const token = await requestPermissionsAndGetToken();
      if (token) {
        // Send token to the backend
        await notificationServices.saveToken(token, user.id);
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
  }, [user]);

  return null; // No UI just cool logic
}
