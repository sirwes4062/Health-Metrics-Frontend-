import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
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

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}