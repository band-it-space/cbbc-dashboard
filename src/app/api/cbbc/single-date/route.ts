export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const underlying = searchParams.get("underlying");
  const target_date = searchParams.get("target_date");

  console.log("Single date API called with:", { underlying, target_date });

  if (!underlying || !target_date) {
    console.log("Missing parameters");
    return new Response(
      "Missing required parameters: underlying and target_date",
      {
        status: 400,
      }
    );
  }

  try {
    const url = `http://13.230.195.0:8000/metrics/cbbc/single-date?underlying=${underlying}&target_date=${target_date}`;
    console.log("Fetching from external API:", url);

    const res = await fetch(url);
    console.log("External API response status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.log("External API error:", errorText);
      return new Response(`Failed to fetch CBBC data: ${errorText}`, {
        status: res.status,
      });
    }

    const data = await res.json();
    console.log("External API response data length:", data?.length);

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Single date API error:", error);
    return new Response("Internal server error", {
      status: 500,
    });
  }
}
