"use server";

import { axios_instance } from "@/axios";
import type { Response as ApiResponse } from "@/types/response";

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
}

export interface OrderProduct {
  id: number;
  name: string;
  slug: string;
  images: string[];
}

export interface OrderItem {
  id: number;
  product_id: number;
  product: OrderProduct;
  quantity: number;
  per_price: number;
}

export interface Order {
  id: number;
  customer_id: number;
  customer?: {
    id: number;
    name: string;
    profile_picture?: string | null;
  } | null;
  total_price: number;
  delivery_address: DeliveryAddress;
  status: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrdersResponse {
  items: Order[];
  total: number;
}

export async function createOrderFromCart(
  deliveryAddress: DeliveryAddress,
): Promise<ApiResponse<Order>> {
  const response = await axios_instance.post<ApiResponse<Order>>(
    "/orders/cart",
    deliveryAddress,
  );
  return response.data;
}

export async function getOrders(): Promise<ApiResponse<Order[]>> {
  const response = await axios_instance.get<ApiResponse<Order[]>>("/orders");
  return response.data;
}

export async function getOrder(orderId: number): Promise<ApiResponse<Order>> {
  const response = await axios_instance.get<ApiResponse<Order>>(
    `/orders/${orderId}`,
  );
  return response.data;
}
