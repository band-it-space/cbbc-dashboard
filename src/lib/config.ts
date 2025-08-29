// Конфигурация приложения
export const config = {
  // Telegram Bot
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || "",
    chatId: process.env.TELEGRAM_CHAT_ID || "",
  },

  // Backend API - используем текущие рабочие endpoints
  backend: {
    baseUrl: process.env.BACKEND_API_URL || "http://52.195.141.129:8000",
    endpoints: {
      cbbc: process.env.CBBC_API_BASE || "/metrics/cbbc",
      ko: process.env.KO_API_BASE || "/metrics/ko",
      underlyings: process.env.UNDERLYINGS_API_BASE || "/metrics/underlyings",
    },
  },

  // Environment
  env: process.env.NODE_ENV || "development",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",

  // Validation
  validate() {
    const errors: string[] = [];

    if (!this.telegram.botToken) {
      errors.push("TELEGRAM_BOT_TOKEN is required");
    }
    if (!this.telegram.chatId) {
      errors.push("TELEGRAM_CHAT_ID is required");
    }
    if (!this.backend.baseUrl) {
      errors.push("BACKEND_API_URL is required");
    }

    if (errors.length > 0) {
      console.warn("Configuration validation warnings:", errors);
    }

    return errors.length === 0;
  },
};

// Проверяем конфигурацию при запуске
if (typeof window === "undefined") {
  // Только на сервере
  config.validate();
}
