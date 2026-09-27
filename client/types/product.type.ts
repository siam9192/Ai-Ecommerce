import { Review } from "./review.type";

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  regular_price: number;
  main_price: number;
  images: string[];
  available_stock: number;
  rating?: number;
  category?: string;
  status?: string;
  reviews?: Review[];
  cart_item_listed?: boolean;
  wish_listed?: boolean;
  created_at: string;
  updated_at: string;
}
