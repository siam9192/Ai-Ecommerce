import { Review } from "./review.type";

export interface Product {
  id:number
  name: string;
  slug:string
  regular_price:number
  main_price: number;
  description: string;
  images: string[];
  available_stock: number;
  rating: number;
  category?: string;
  reviews?: Review[];
  cart_listed:boolean
  wish_listed:boolean
  created_at:string
  updated_at:string
}




