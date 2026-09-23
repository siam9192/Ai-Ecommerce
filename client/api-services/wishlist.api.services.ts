"use server";

import { axios_instance } from "@/axios";
import type {
  WishlistItemPayload,
  WishlistItemResponse,
} from "@/types/wishlist.type";
import type { Response as ApiResponse } from "@/types/response";

export async function getWishlist(): Promise<
  ApiResponse<WishlistItemResponse[]>
> {
  const response =
    await axios_instance.get<ApiResponse<WishlistItemResponse[]>>("/wishlist");
  return response.data;
}

export async function getItem(
  productId: number,
): Promise<ApiResponse<WishlistItemResponse | null>> {
  const response = await axios_instance.get<
    ApiResponse<WishlistItemResponse | null>
  >(`/wishlist/items/${productId}`);
  return response.data;
}

export async function addItem(
  payload: WishlistItemPayload,
): Promise<ApiResponse<WishlistItemResponse>> {
  const response = await axios_instance.post<ApiResponse<WishlistItemResponse>>(
    "/wishlist/items",
    payload,
  );
  return response.data;
}

export async function removeItem(
  payload: WishlistItemPayload,
): Promise<ApiResponse<boolean>> {
  const response = await axios_instance.delete<ApiResponse<boolean>>(
    "/wishlist/items",
    { data: payload },
  );
  return response.data;
}

export async function clear(): Promise<ApiResponse<boolean>> {
  const response =
    await axios_instance.delete<ApiResponse<boolean>>("/wishlist");
  return response.data;
}
