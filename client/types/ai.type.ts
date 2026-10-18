import { ProductStatus } from "./product.type";

export interface ProductResponse {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  regular_price: number;
  main_price: number;
  images: string[];
  available_stock: number;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
  wish_listed?: boolean | null;
  cart_item_listed?: boolean | null;
}

export interface AIActions {
  client_navigate_to?: string | null;
  product_ai_search_results?: ProductResponse[];
  client_logout: boolean;
  cart_update: boolean;
  order_update: boolean;
  product_update: boolean;
  review_update: boolean;
  user_update: boolean;
}

export interface AIFinalResponse {
  /** Final response displayed directly to the user. */
  message: string;

  /** Overall result of the requested operation. */
  status: "success" | "error" | "partial" | "info";

  /** Short summary of what was done. */
  summary?: string | null;

  /** Actions the frontend/client should perform. */
  actions: AIActions;
}