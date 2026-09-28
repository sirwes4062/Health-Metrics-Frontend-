import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();

  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 },
    );
  }

  const response = await fetch(
    `${process.env.NEST_API_URL}/patients`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  const data = await response.json();

  return NextResponse.json(data, {
    status: response.status,
  });
}