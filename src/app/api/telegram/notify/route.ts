import { config } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const {
      endpoint,
      error,
      message,
      severity = "error",
    } = await request.json();

    const botToken = config.telegram.botToken;
    const chatId = config.telegram.chatId;

    if (!botToken || !chatId) {
      console.error("Telegram bot not configured");
      return Response.json(
        { error: "Telegram not configured" },
        { status: 500 }
      );
    }

    // Формируем сообщение в зависимости от severity
    const emoji =
      severity === "error" ? "🚨" : severity === "warning" ? "⚠️" : "ℹ️";
    const title =
      severity === "error"
        ? "CBBC Dashboard Error"
        : severity === "warning"
        ? "CBBC Dashboard Warning"
        : "CBBC Dashboard Info";

    const telegramMessage =
      `${emoji} ${title}\n\n` +
      `📍 Endpoint: <code>${endpoint}</code>\n` +
      `❌ Error: ${error}\n` +
      `📝 Details: ${message || "No additional details"}\n` +
      `⏰ Time: ${new Date().toISOString()}\n\n` +
      `🔄 Action: ${
        severity === "error" ? "Restart AWS instance" : "Check logs"
      }`;

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMessage,
          parse_mode: "HTML",
          disable_notification: true, // Отключаем звук уведомлений
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Telegram API error: ${errorData.description || response.statusText}`
      );
    }

    return Response.json({ success: true, message: "Notification sent" });
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
    return Response.json(
      {
        error: "Notification failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
