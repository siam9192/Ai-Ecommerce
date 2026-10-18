"use server";

import { axios_instance } from "@/axios";
import type { ProductReview } from "@/types/review.type";
import type { Response as ApiResponse } from "@/types/response";

export interface AddProductReviewPayload {
  product_id: number;
  rating: number;
  comment?: string;
}

export async function getProductReviews(
  productId: number,
): Promise<ApiResponse<ProductReview[]>> {
  const response = await axios_instance.get<ApiResponse<ProductReview[]>>(
    `/reviews/product/${productId}`,
  );

  return response.data;
}

export async function getUserReviews(
  userId: number,
): Promise<ApiResponse<ProductReview[]>> {
  const response = await axios_instance.get<ApiResponse<ProductReview[]>>(
    `/reviews/user/${userId}`,
  );

  return response.data;
}

export async function addProductReview(
  payload: AddProductReviewPayload,
): Promise<ApiResponse<ProductReview>> {
  const response = await axios_instance.post<ApiResponse<ProductReview>>(
    "/reviews",
    payload,
  );

  return response.data;
}
