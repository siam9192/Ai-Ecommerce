"use server"
import { axios_instance } from "@/axios";
import { Product } from "@/types/product.type";
import { Response as ApiResponse } from "@/types/response";
import type { ProductStatus } from "@/types/product.type";

export interface CreateProductPayload {
  name: string;
  description: string;
  regular_price: number;
  main_price: number;
  images: string[];
  category: string;
  available_stock: number;
  status: ProductStatus;
}

  export async function getProductBySlug  (slug: string): Promise<ApiResponse<Product>>  {
    const response = await axios_instance.get<ApiResponse<Product>>(
      `/products/slug/${encodeURIComponent(slug)}`,
    );

    return response.data;
  }

  export async function getFeaturedProducts():Promise<ApiResponse<Product[]>> {
    const response =
      await axios_instance.get<ApiResponse<Product[]>>("/products/featured");

    return response.data;
  }

  export async function searchProducts (search?: string): Promise<ApiResponse<Product[]>> {
    const response = await axios_instance.get<ApiResponse<Product[]>>(
      "/products",
      {
        params: {
          ...(search?.trim() ? { keyword: search.trim() } : {}),
        },
      },
    );

    return response.data;
  }

  export async function getProducts():Promise<ApiResponse<Product[]>>  {
    const response = await axios_instance.get<ApiResponse<Product[]>>(
      "/products",
      {
        params: {
          limit: 100,
        },
      },
    );

    return response.data;
  }

  export async function createProduct(
    payload: CreateProductPayload,
  ): Promise<ApiResponse<{ id: number }>> {
    const response = await axios_instance.post<ApiResponse<{ id: number }>>(
      "/products",
      payload,
    );

    return response.data;
  }
