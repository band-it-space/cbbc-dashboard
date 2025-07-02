export async function GET() {
  const res = await fetch("http://13.230.195.0:8000/metrics/underlyings");
  if (!res.ok) {
    return new Response("Failed to fetch underlyings list", {
      status: res.status,
    });
  }

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
