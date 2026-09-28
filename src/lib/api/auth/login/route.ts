import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEST_API_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data.message || "Invalid email or password",
        },
        {
          status: response.status,
        }
      );
    }

    const cookieStore = await cookies();

    cookieStore.set("access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",

      // 1 day
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.json({
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        message: "Unable to connect to the server",
      },
      {
        status: 500,
      }
    );
  }
}