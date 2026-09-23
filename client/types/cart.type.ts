import type { Product } from "@/types/product.type";

export interface CartItem {
  id: number;
  productId?: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  inStock?: boolean;
}

export interface CartItemResponse {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  product?: Product;
}

export interface AddCartItemPayload {
  product_id: number;
  quantity?: number;
}

export interface UpdateCartItemPayload {
  quantity?: number;
}
