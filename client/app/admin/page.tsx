import { getOrders, type Order } from "@/api-services/order.api.services";
import { productService } from "@/api-services/products.api.services";
import { getUsers } from "@/api-services/user.api.services";
import AppStatePageTracker from "@/components/shared/app-state-page-tracker";
import { User } from "@/types/user.type";
import {
  FiBarChart2,
  FiBox,
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";
const statusClass: Record<string, string> = {
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

export default async function AdminDashboardPage() {
  const [ordersResponse, usersResponse, productsResponse] = await Promise.all([
    getOrders(),
    getUsers(),
    productService.searchProducts(),
  ]);
  

  const orders = ordersResponse.success ? ordersResponse.data : [];
  const customers = (usersResponse.success ? usersResponse.data : []).filter(
    (user: User) => user.role.toLowerCase() === "customer",
  );
  const products = productsResponse.success ? productsResponse.data : [];

  const overviewCards = [
    {
      label: "Revenue",
      value: formatMoney(
        orders.reduce(
          (sum: number, order: Order) => sum + Number(order.total_price || 0),
          0,
        ),
      ),
      change: `${orders.length} orders`,
      icon: FiDollarSign,
      tone: "bg-violet-100 text-violet-600",
    },
    {
      label: "Orders",
      value: orders.length.toLocaleString(),
      change: `${orders.filter((order: Order) => order.status.toLowerCase() === "pending").length} pending`,
      icon: FiShoppingBag,
      tone: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Customers",
      value: customers.length.toLocaleString(),
      change: `${customers.filter((user: User) => user.status.toLowerCase() === "active").length} active`,
      icon: FiUsers,
      tone: "bg-blue-100 text-blue-600",
    },
    {
      label: "Products",
      value: products.length.toLocaleString(),
      change: `${products.filter((product) => Number(product.available_stock || 0) > 0).length} in stock`,
      icon: FiBox,
      tone: "bg-amber-100 text-amber-600",
    },
  ];

  const recentOrders = [...orders]
    .sort(
      (a: Order, b: Order) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 4);

  const topProducts = [...products]
    .sort((a, b) => Number(b.main_price || 0) - Number(a.main_price || 0))
    .slice(0, 4)
    .map((product) => ({
      name: product.name,
      sales: Number(product.available_stock || 0),
      revenue: formatMoney(
        Number(product.main_price || 0) * Number(product.available_stock || 0),
      ),
    }));

  return (
    <>
      <AppStatePageTracker
        page="orders"
        ids={orders.map((order: Order) => order.id)}
      />
      <div className="space-y-8">
        <header className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                Admin dashboard
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                Overview
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover"
              >
                + Add product
              </button>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map(({ label, value, change, icon: Icon, tone }) => (
            <div
              key={label}
              className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}
                >
                  <Icon size={20} />
                </div>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                  {change}
                </span>
              </div>

              <p className="mt-6 text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                Revenue overview
              </h2>
              <span className="text-sm text-slate-500">Live totals</span>
            </div>

            <div className="flex h-64 items-end gap-3">
              {[35, 52, 46, 68, 74, 62, 88].map((height, index) => (
                <div
                  key={index}
                  className="flex flex-1 flex-col items-center gap-3"
                >
                  <div
                    className="w-full rounded-t-[16px] bg-gradient-to-t from-primary to-violet-300"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-slate-400">
                    {["M", "T", "W", "T", "F", "S", "S"][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Top products</h2>

            <div className="mt-5 space-y-4">
              {topProducts.map((product) => (
                <div key={product.name} className="rounded-2xl bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {product.sales} in stock
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      {product.revenue}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recent orders</h2>
            <button
              type="button"
              className="text-sm font-medium text-primary hover:text-primary-hover"
            >
              View all
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-3 pr-4 font-medium">Order ID</th>
                  <th className="pb-3 pr-4 font-medium">Customer</th>
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 pr-4 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order: Order) => (
                  <tr
                    key={order.id}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <td className="py-3 pr-4 font-semibold text-slate-900">
                      #{order.id}
                    </td>
                    <td className="py-3 pr-4 text-slate-700">
                      {order.customer?.name ?? `Customer ${order.customer_id}`}
                    </td>
                    <td className="py-3 pr-4 text-slate-700">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-4 font-medium text-slate-900">
                      {formatMoney(order.total_price)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[order.status.toLowerCase()] ?? "bg-slate-100 text-slate-700"}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
