"use server";

import { axios_instance } from "@/axios";
import type { Response as ApiResponse } from "@/types/response";
import { User } from "@/types/user.type";


export async function getUsers(): Promise<ApiResponse<User[]>> {
  const response =
    await axios_instance.get<ApiResponse<User[]>>("/users");
  return response.data;
}
