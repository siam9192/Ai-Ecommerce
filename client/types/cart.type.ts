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

export interface AddCartItemPayload {
  product_id: number;
  quantity?: number;
}

export interface UpdateCartItemPayload {
  quantity?: number;
}
