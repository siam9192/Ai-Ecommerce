"use server";

import { axios_instance } from "@/axios";
import type {
  AddCartItemPayload,
  CartItemResponse,
  UpdateCartItemPayload,
} from "@/types/cart.type";
import type { Response as ApiResponse } from "@/types/response";

export async function getCart(): Promise<ApiResponse<CartItemResponse[]>> {
  const response =
    await axios_instance.get<ApiResponse<CartItemResponse[]>>("/cart");
  return response.data;
}

export async function getCartItem(
  productId: number,
): Promise<ApiResponse<CartItemResponse | null>> {
  const response = await axios_instance.get<
    ApiResponse<CartItemResponse | null>
  >(`/cart/items/${productId}`);
  return response.data;
}

export async function addItem(
  payload: AddCartItemPayload,
): Promise<ApiResponse<{ id: number }>> {
  const response = await axios_instance.post<ApiResponse<{ id: number }>>(
    "/cart/items",
    payload,
  );
  return response.data;
}

export async function updateItem(
  productId: number,
  payload: UpdateCartItemPayload,
): Promise<ApiResponse<CartItemResponse>> {
  const response = await axios_instance.patch<ApiResponse<CartItemResponse>>(
    `/cart/items/${productId}`,
    payload,
  );
  return response.data;
}

export async function removeItem(
  productId: number,
): Promise<ApiResponse<boolean>> {
  const response = await axios_instance.delete<ApiResponse<boolean>>(
    `/cart/items/${productId}`,
  );
  return response.data;
}

export async function clear(): Promise<ApiResponse<boolean>> {
  const response = await axios_instance.delete<ApiResponse<boolean>>("/cart");
  return response.data;
}
