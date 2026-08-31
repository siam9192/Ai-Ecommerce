import { Review } from "./review.type";

export interface Product {
  id:number
  name: string;
  slug:string
  price: number;
  description: string;
  images: string[];
  stock: number;
  rating: number;
  category?: string;
  reviews?: Review[];
}
