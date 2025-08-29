import { useCallback } from "react";

type Severity = "error" | "warning" | "info";

interface NotificationData {
  endpoint: string;
  error: string;
  message?: string;
  severity?: Severity;
}

export const useErrorNotification = () => {
  const sendNotification = useCallback(async (data: NotificationData) => {
    try {
      const response = await fetch("/api/telegram/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error("Failed to send notification:", response.statusText);
      }

      return response.ok;
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

  return {
    sendNotification,
    sendErrorNotification,
    sendWarningNotification,
    sendInfoNotification,
  };
};
