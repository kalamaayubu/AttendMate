import admin from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

const BACKEND_API_KEY = process.env.BACKEND_API_KEY;
console.log(
  "First line of private key:",
  process.env.FIREBASE_PRIVATE_KEY?.slice(0, 40)
);

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey || apiKey !== BACKEND_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token, title, body, data } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const message = {
      token,
      notification: {
        title: title || "Default Title",
        body: body || "Default Body",
      },
      android: {
        priority: "high",
        notification: {
          channelId: "default",
        },
      },
      data: data || {},
    };

    // Send the message
    const response = await admin.messaging().send(message);

    return NextResponse.json({ success: true, messageId: response });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
