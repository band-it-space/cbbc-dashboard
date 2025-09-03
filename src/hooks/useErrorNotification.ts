import { useCallback, useRef } from "react";

type Severity = "error" | "warning" | "info";

interface NotificationData {
  endpoint: string;
  error: string;
  message?: string;
  severity?: Severity;
}

export const useErrorNotification = () => {
  const sentNotifications = useRef<Set<string>>(new Set());

  const sendNotification = useCallback(async (data: NotificationData) => {
    // Создаем уникальный ключ для уведомления
    const notificationKey = `${data.endpoint}-${data.error}-${data.severity}`;

    // Проверяем, не отправляли ли мы уже это уведомление
    if (sentNotifications.current.has(notificationKey)) {
      console.log("Notification already sent, skipping:", notificationKey);
      return true;
    }

    try {
      const response = await fetch("/api/telegram/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error("Failed to send notification:", response.statusText);
        return false;
      }

      // Помечаем уведомление как отправленное
      sentNotifications.current.add(notificationKey);
      return true;
    } catch (err) {
      console.error("Failed to send error notification:", err);
      return false;
    }
  }, []);

  const sendErrorNotification = useCallback(
    (endpoint: string, error: string, message?: string) => {
      return sendNotification({ endpoint, error, message, severity: "error" });
    },
    [sendNotification]
  );

  const sendWarningNotification = useCallback(
    (endpoint: string, error: string, message?: string) => {
      return sendNotification({
        endpoint,
        error,
        message,
        severity: "warning",
      });
    },
    [sendNotification]
  );

  const sendInfoNotification = useCallback(
    (endpoint: string, error: string, message?: string) => {
      return sendNotification({ endpoint, error, message, severity: "info" });
    },
    [sendNotification]
  );

  const clearNotificationCache = useCallback(() => {
    sentNotifications.current.clear();
  }, []);

  return {
    sendNotification,
    sendErrorNotification,
    sendWarningNotification,
    sendInfoNotification,
    clearNotificationCache,
  };
};
