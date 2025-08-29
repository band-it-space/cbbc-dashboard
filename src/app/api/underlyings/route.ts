import { config } from "@/lib/config";

export async function GET() {
  const res = await fetch(
    `${config.backend.baseUrl}${config.backend.endpoints.underlyings}`
  );
  if (!res.ok) {
    return new Response("Failed to fetch underlyings", {
      status: res.status,
    });
  }

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
