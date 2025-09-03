"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.sendTelegramNotification(error, errorInfo);

    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private async sendTelegramNotification(error: Error, errorInfo: any) {
    try {
      // Clean up the stack trace to remove HTML tags and make it Telegram-friendly
      const cleanComponentStack = errorInfo.componentStack
        ?.replace(/<[^>]*>/g, "") // Remove HTML tags
        ?.replace(/\s+/g, " ") // Normalize whitespace
        ?.substring(0, 1000); // Limit length

      const cleanErrorStack = error.stack
        ?.replace(/<[^>]*>/g, "") // Remove HTML tags
        ?.replace(/\s+/g, " ") // Normalize whitespace
        ?.substring(0, 1000); // Limit length

      await fetch("/api/telegram/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: "Client Error",
          error: error.message,
          message: `Component Stack: ${
            cleanComponentStack || "N/A"
          }\nError Stack: ${cleanErrorStack || "N/A"}`,
          severity: "error",
        }),
      });
    } catch (err) {
      console.error("Failed to send error notification:", err);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-lg font-medium text-gray-900">
                Something went wrong
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                An error has occurred and has been reported to our team. Please
                try refreshing the page.
              </p>
              <div className="mt-4">
                <button
                  onClick={() => {
                    this.setState({ hasError: false });
                    window.location.reload();
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
