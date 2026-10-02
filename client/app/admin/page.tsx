import { getOrders, type Order } from "@/api-services/order.api.services";
import { getAdminOverview } from "@/api-services/overview.api.services";
import { getProducts } from "@/api-services/products.api.services";
import { getUsers } from "@/api-services/user.api.services";
import AppStatePageTracker from "@/components/shared/app-state-page-tracker";
import { FiBox, FiDollarSign, FiShoppingBag, FiUsers } from "react-icons/fi";

export interface AdminOverview {
  total_revenue: number;
  products_count: number;
  products_active: number;
  products_in_stock: number;
  orders_count: number;
  customers_count: number;
  pending_orders: number;
}

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
  const [
    admin_overview_response,
    orders_response,
    products_response,
    users_response,
  ] = await Promise.all([
    getAdminOverview(),
    getOrders(),
    getProducts(),
    getUsers(),
  ]);

  const admin_overview: AdminOverview = admin_overview_response?.data ?? {
    total_revenue: 0,
    products_count: 0,
    products_active: 0,
    products_in_stock: 0,
    orders_count: 0,
    customers_count: 0,
    pending_orders: 0,
  };

  const orders: Order[] = orders_response?.success ? orders_response.data : [];

  const products = products_response?.success ? products_response.data : [];

  const customers = users_response?.success ? users_response.data : [];

  const overviewCards = [
    {
      label: "Revenue",
      value: formatMoney(admin_overview.total_revenue),
      change: `${admin_overview.orders_count} orders`,
      icon: FiDollarSign,
      tone: "bg-violet-100 text-violet-600",
    },
    {
      label: "Orders",
      value: admin_overview.orders_count.toLocaleString(),
      change: `${admin_overview.pending_orders} pending`,
      icon: FiShoppingBag,
      tone: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Customers",
      value: admin_overview.customers_count.toLocaleString(),
      change: "Total customers",
      icon: FiUsers,
      tone: "bg-blue-100 text-blue-600",
    },
    {
      label: "Products",
      value: admin_overview.products_count.toLocaleString(),
      change: `${admin_overview.products_in_stock} in stock`,
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

            <button
              type="button"
              className="rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover"
            >
              + Add product
            </button>
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

        {/* Rest of your UI stays the same */}
      </div>
    </>
  );
}
