import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.toString();

    console.log(
      `Proxying request to: http://52.195.141.129:8000/metrics/cbbc/cbbc/ko/?${query}`
    );

    const res = await fetch(
      `http://52.195.141.129:8000/metrics/cbbc/cbbc/ko/?${query}`
    );

    if (!res.ok) {
      if (res.status === 404) {
        // 404 means no data found, return empty array
        console.log("No data found for the given parameters");
        return NextResponse.json([]);
      }
      console.error(`External API error: ${res.status} ${res.statusText}`);
      return NextResponse.json(
        { error: "Failed to fetch KO data" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
