import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const query = url.searchParams.toString();

  const res = await fetch(
    `http://52.195.141.129:8000/metrics/cbbc/aggregate?${query}`
  );
  if (!res.ok) {
    return new Response("Failed to fetch aggregated data", {
      status: res.status,
    });
  }

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
