"use server";

import { axios_instance } from "@/axios";
import { cookies } from "next/headers";
import {
  AuthResponse,
  CurrentUser,
  LoginRequest,
  SignupRequest,
} from "@/types/auth.type";
import { Response as ApiResponse } from "@/types/response";

export async function getCurrentUser(): Promise<ApiResponse<CurrentUser>> {
  const response =
    await axios_instance.get<ApiResponse<CurrentUser>>("/auth/me");

  return response.data;
}

export async function login(
  credentials: LoginRequest,
): Promise<ApiResponse<AuthResponse>> {
  const response = await axios_instance.post<ApiResponse<AuthResponse>>(
    "/auth/login",
    credentials,
  );

  const token = response.data.data.access_token;
  (await cookies()).set("access_token", token, {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  expires: new Date(Date.now() + 1000 * 60 * 2000),
});

  return response.data;
}

export async function signup(
  credentials: SignupRequest,
): Promise<ApiResponse<CurrentUser>> {
  const response = await axios_instance.post<ApiResponse<CurrentUser>>(
    "/auth/register",
    credentials,
  );

  return response.data;
}
