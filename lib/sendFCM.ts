import fs from "fs";
import { google } from "googleapis";
import fetch from "node-fetch";

const keyFile = "./attendmate-firebase-adminsdk.json"; // Path to your downloaded service account JSON
const SCOPES = ["https://www.googleapis.com/auth/firebase.messaging"];

// Get the device token from command line args
const deviceToken = process.argv[2];
console.log("🔑 Device Token:", deviceToken);

if (!deviceToken) {
  console.error("❌ Usage: ts-node sendFCM.ts <device_token>");
  process.exit(1);
}

interface ServiceAccount {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain?: string;
}

async function getAccessToken(): Promise<string> {
  const key: ServiceAccount = JSON.parse(fs.readFileSync(keyFile, "utf8"));
  const jwtClient = new google.auth.JWT(
    key.client_email,
    undefined,
    key.private_key,
    SCOPES,
    undefined
  );

  const tokens = await jwtClient.authorize();
  return tokens.access_token!;
}

async function sendNotification(): Promise<void> {
  const accessToken = await getAccessToken();
  const key: ServiceAccount = JSON.parse(fs.readFileSync(keyFile, "utf8"));

  const message = {
    message: {
      token: deviceToken,
      notification: {
        title: "🚀 Hello from AttendMate!",
        body: "This notification was sent via Firebase Cloud Messaging (FCM)",
      },
      data: {
        screen: "home",
        info: "manual_test",
      },
    },
  };

  const url = `https://fcm.googleapis.com/v1/projects/${key.project_id}/messages:send`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  const data = await response.json();
  console.log("📨 FCM Response:", data);
}

// Run the function
sendNotification().catch((error) => {
  console.error("❌ Error sending FCM message:", error);
});
