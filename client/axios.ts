"use server";
import axios from "axios";
import { env } from "@/env";
import { cookies } from "next/headers";

export const axios_instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axios_instance.interceptors.request.use(async (config) => {
  const accessToken = (await cookies()).get("access_token")?.value;

  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return config;
});
