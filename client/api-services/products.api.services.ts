import { axios_instance } from "@/axios";
import { Product } from "@/types/product.type";
import { Response as ApiResponse } from "@/types/response";

export const productService = {
  getProductBySlug: async (slug: string): Promise<ApiResponse<Product>> => {
    const response = await axios_instance.get<ApiResponse<Product>>(
      `/products/slug/${encodeURIComponent(slug)}`,
    );

    return response.data;
  },

  getFeaturedProducts: async (): Promise<ApiResponse<Product[]>> => {
    const response =
      await axios_instance.get<ApiResponse<Product[]>>("/products/featured");

    return response.data;
  },

  searchProducts: async (search?: string): Promise<ApiResponse<Product[]>> => {
    const response = await axios_instance.get<ApiResponse<Product[]>>(
      "/products",
      {
        params: {
          ...(search?.trim() ? { keyword: search.trim() } : {}),
        },
      },
    );

    return response.data;
  },
};
