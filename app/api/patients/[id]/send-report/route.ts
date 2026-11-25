import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_API_URL is not configured on Vercel" },
      { status: 500 },
    );
  }

  try {
    const { id } = await context.params;
    const cookieStore = await cookies();
    const token =
      cookieStore.get("token")?.value || cookieStore.get("access_token")?.value;

    const res = await fetch(`${BACKEND_URL}/patients/${id}/send-report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const text = await res.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          message: `Backend returned non-JSON (${res.status}): ${text.slice(0, 150)}`,
        },
        { status: 502 },
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Proxy request failed",
      },
      { status: 500 },
    );
  }
}
