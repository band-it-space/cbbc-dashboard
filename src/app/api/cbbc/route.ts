import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const query = url.searchParams.toString();

  const res = await fetch(
    `http://13.49.78.35:8000/metrics/cbbc/metrics/cbbc/aggregate?${query}`
  );
  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
