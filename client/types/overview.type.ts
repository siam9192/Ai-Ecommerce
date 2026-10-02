export interface AdminOverview {
  total_revenue: number;
  products_count: number;
  products_active: number;
  products_in_stock: number;
  orders_count: number;
  customers_count: number;
  pending_orders: number;
}

export interface OrdersOverview {
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  total_revenue: number;
}