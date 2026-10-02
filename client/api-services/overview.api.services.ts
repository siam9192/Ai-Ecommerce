import { axios_instance } from "@/axios";
import { AdminOverview, OrdersOverview } from "@/types/overview.type";
import type { Response as ApiResponse } from "@/types/response";

export async function getAdminOverview(): Promise<ApiResponse<AdminOverview>> {
  const response =
    await axios_instance.get<ApiResponse<AdminOverview>>(`/overview/admin`);
  return response.data;
}

export async function getOrdersOverview(): Promise<
  ApiResponse<OrdersOverview>
> {
  const response =
    await axios_instance.get<ApiResponse<OrdersOverview>>(`/overview/orders`);
  return response.data;
}
