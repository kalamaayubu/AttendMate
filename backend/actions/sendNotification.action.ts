import { google } from "googleapis";
import { NotificationPayload } from "../../types/index";

export async function sendNotification({
  token,
  title,
  body,
  data,
}: NotificationPayload) {
  // Prepare google auth cleint that can request access tokens for FCM
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
  });

  // Give client capability to request access tokens
  const client = await auth.getClient();

  // FCM v1 HTTP endpoint
  const url = `https://fcm.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}/messages:send`;

  // The actual payload to send to FCM(Can be extended with data messages, images, etc)
  const message = {
    message: {
      token,
      notification: {
        title,
        body,
      },
      data,
    },
  };

  // Make the request to FCM with the message payload
  const res = await client.request({
    url,
    method: "POST",
    data: message,
  });

  // Return FCM response
  return res.data;
}
