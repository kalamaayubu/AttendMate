export async function sendNotification({
  token,
  title,
  body,
  data,
}: {
  token: string | string[];
  title: string;
  body: string;
  data: Record<string, string>;
}) {
  try {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/send-notification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.EXPO_PUBLIC_BACKEND_API_KEY!,
        },
        body: JSON.stringify({
          token,
          title,
          body,
          data,
        }),
      }
    );

    const result = await res.json();
    console.log("Notification response:", result);

    return result;
  } catch (error) {
    console.error("Error sending notification:", error);
    return { success: false, error: String(error) };
  }
}
