import { apiFetch } from "./client";
import type { LoginResponse } from "../types/auth";

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",

    body: JSON.stringify({
      email,
      password,
    }),
  });
}