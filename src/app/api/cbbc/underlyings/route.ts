export async function GET() {
  const res = await fetch("http://52.195.141.129:8000/metrics/cbbc/underlyings");
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
