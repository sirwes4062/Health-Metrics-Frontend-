import { NextResponse } from "next/server";
import { getApiUrl } from "@/src/lib/api/client";

export async function GET() {
  if (!process.env.NEST_API_URL) {
    return NextResponse.json(
      { message: "NEST_API_URL is not configured" },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(getApiUrl("/analytics/overview"), {
      cache: "no-store",
    });
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Analytics overview error:", error);
    return NextResponse.json(
      { message: "Unable to load analytics" },
      { status: 500 },
    );
  }
}
