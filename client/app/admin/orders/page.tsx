import Link from "next/link";
import { getOrders, type Order } from "@/api-services/order.api.services";
import AppStatePageTracker from "@/components/shared/app-state-page-tracker";
import { FiArrowLeft, FiPackage, FiSearch, FiTruck } from "react-icons/fi";
import { getOrdersOverview } from "@/api-services/overview.api.services";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}
export default async function AdminOrdersPage() {
  const orders_response = await getOrders();
  const orders = orders_response.success ? orders_response.data : [];

  const orders_overview_response = await getOrdersOverview();

  const orders_overview = orders_overview_response.success
    ? orders_overview_response.data
    : {
        total_orders: 0,
        pending_orders: 0,
        completed_orders: 0,
        cancelled_orders: 0,
        total_revenue: 0,
      };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 lg:px-6">
      <AppStatePageTracker
        page="orders"
        ids={orders.map((order: Order) => order.id)}
      />

      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-primary"
            >
              <FiArrowLeft size={16} />
              Back to dashboard
            </Link>

            <h1 className="mt-3 text-3xl font-bold text-slate-900">Orders</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-500 shadow-sm">
              <FiSearch size={16} />

              <input
                type="text"
                placeholder="Search orders"
                className="w-40 border-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              type="button"
              className="rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Overview */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {/* Total Orders */}
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total orders</p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {orders_overview.total_orders}
            </p>
          </div>

          {/* Pending Orders */}
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Pending</p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {orders_overview.pending_orders}
            </p>
          </div>

          {/* Completed Orders */}
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Completed</p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {orders_overview.completed_orders}
            </p>
          </div>

          {/* Cancelled Orders */}
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Cancelled</p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {orders_overview.cancelled_orders}
            </p>
          </div>

          {/* Revenue */}
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Revenue</p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {formatMoney(orders_overview.total_revenue)}
            </p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-2 text-slate-900">
              <FiPackage size={18} />

              <h2 className="text-xl font-bold">Recent orders</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Items</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order: Order) => (
                  <tr
                    key={order.id}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    {/* Order */}
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      #{order.id}
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4 text-slate-700">
                      {order.customer?.name ?? `Customer ${order.customer_id}`}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-slate-700">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>

                    {/* Items */}
                    <td className="px-5 py-4 text-slate-700">
                      {order.items.length}
                    </td>

                    {/* Total */}
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {formatMoney(order.total_price)}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusStyles[order.status.toLowerCase()] ??
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
                      >
                        <FiTruck size={12} />
                        Track
                      </button>
                    </td>
                  </tr>
                ))}

                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-10 text-center text-sm text-slate-500"
                    >
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
