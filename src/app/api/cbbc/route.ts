import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const query = url.searchParams.toString();

  const res = await fetch(`http://16.16.186.84:8000/metrics/cbbc/?${query}`);
  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
