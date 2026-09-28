import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.NEST_API_URL;

async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value;
}

export async function POST(request: Request) {
  if (!API_URL) {
    return NextResponse.json(
      { message: "NEST_API_URL is not configured" },
      { status: 500 },
    );
  }

  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const response = await fetch(`${API_URL}/patients`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Patient registration error:", error);
    return NextResponse.json(
      { message: "Unable to connect to the server" },
      { status: 500 },
    );
  }
}
