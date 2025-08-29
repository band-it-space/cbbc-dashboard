import { NextRequest } from "next/server";
import { config } from "@/lib/config";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const query = url.searchParams.toString();

  const res = await fetch(
    `${config.backend.baseUrl}${config.backend.endpoints.ko}?${query}`
  );
  if (!res.ok) {
    return new Response("Failed to fetch KO data", {
      status: res.status,
    });
  }

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
