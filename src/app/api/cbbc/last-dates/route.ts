import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const ul = url.searchParams.get("ul");
  if (!ul) {
    return new Response(JSON.stringify({ error: "ul is required" }), {
      status: 400,
    });
  }
  const res = await fetch(
    `http://13.230.195.0:8000/metrics/cbbc/last-dates?ul=${ul}`
  );
  if (!res.ok) {
    return new Response("Failed to fetch available dates", {
      status: res.status,
    });
  }
  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
