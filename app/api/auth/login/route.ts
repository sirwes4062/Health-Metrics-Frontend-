import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getApiUrl } from "@/src/lib/api/client";

const API_URL = process.env.NEST_API_URL;

export async function POST(request: Request) {
  if (!API_URL) {
    return NextResponse.json(
      { message: "NEST_API_URL is not configured" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const response = await fetch(getApiUrl("/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Invalid email or password" },
        { status: response.status },
      );
    }

    const cookieStore = await cookies();
    cookieStore.set("access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Unable to connect to the server" },
      { status: 500 },
    );
  }
}
