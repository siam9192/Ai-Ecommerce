import Link from "next/link";
import { getOrders, type Order } from "@/api-services/order.api.services";
import ProtectedRoute from "@/components/auth/protected-route";
import AppStatePageTracker from "@/components/shared/app-state-page-tracker";
import { FiArrowLeft, FiPackage, FiTruck } from "react-icons/fi";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
};

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

function OrdersContent({ orders }: { orders: Order[] }) {
  return (
    <ProtectedRoute customerOnly>
      <main className="container mx-auto min-h-screen px-4 py-10 sm:px-6 lg:px-8">
        <AppStatePageTracker
          page="customer-orders"
          ids={orders.map((order) => order.id)}
        />
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              Order history
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              My orders
            </h1>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <FiPackage size={16} />
            {orders.length} orders
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center">
            <FiPackage className="mx-auto text-primary" size={32} />
            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              No orders yet
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Your completed purchases will appear here.
            </p>
            <Link
              href="/shop"
              className="mt-5 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = order.status.toLowerCase();
              return (
                <div
                  key={order.id}
                  className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Order #{order.id}</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status] ?? "bg-slate-100 text-slate-700"}`}
                      >
                        {formatStatus(order.status)}
                      </span>
                      <span className="text-lg font-bold text-slate-900">
                        ${order.total_price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Items</p>
                      <ul className="mt-2 space-y-1 text-sm text-slate-700">
                        {order.items.map((item) => (
                          <li key={item.id}>
                            {item.product.name} x {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600">
                      <FiTruck size={15} />
                      {order.delivery_address.city},{" "}
                      {order.delivery_address.state}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-primary"
        >
          <FiArrowLeft size={16} />
          Continue shopping
        </Link>
      </main>
    </ProtectedRoute>
  );
}

export default async function MyOrdersPage() {
  try {
    const response = await getOrders();
    return <OrdersContent orders={response.success ? response.data : []} />;
  } catch {
    return (
      <ProtectedRoute customerOnly>
        <main className="container mx-auto min-h-screen px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900">My orders</h1>
          <p className="mt-3 text-sm text-red-600">
            Orders are temporarily unavailable. Please try again shortly.
          </p>
        </main>
      </ProtectedRoute>
    );
  }
}
