"use server";

import { axios_instance } from "@/axios";
import type { AIFinalResponse } from "@/types/ai.type";

export interface AiAskPayload {
  client_state: ClientState;
  chat_history: ChatMessage[];
  message: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClientState {
  current_path: string;
  featured_product_ids: number[];
  shop_product_ids: number[];
  ai_search_product_ids: number[];
  customer_order_ids: number[];
  customer_ids: number[];
  order_ids: number[];
  product_ids: number[];
  cart_item_ids: number[];
  wishlist_item_ids: number[];
}

export async function aiAsk(
  payload: AiAskPayload,
): Promise<AIFinalResponse> {
  const response = await axios_instance.post<AIFinalResponse>(
    "/ai/ask",
    payload,
  );
  return response.data;
}
