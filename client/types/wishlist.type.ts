import type { Product } from "./product.type";

export interface WishlistItemResponse {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  updated_at: string;
}

export interface WishlistItemWithProductResponse extends WishlistItemResponse {
  product: Product;
}

export interface WishlistItemPayload {
  product_id: number;
}
