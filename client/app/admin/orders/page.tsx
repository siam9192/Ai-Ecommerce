import Link from "next/link";
import { FiArrowLeft, FiPackage, FiSearch, FiTruck } from "react-icons/fi";

const orders = [
  {
    id: "#10482",
    customer: "Alicia Gomez",
    total: "$429.99",
    status: "Delivered",
    date: "12 Aug 2026",
    items: 3,
  },
  {
    id: "#10417",
    customer: "Daniel Lee",
    total: "$129.95",
    status: "In transit",
    date: "02 Aug 2026",
    items: 1,
  },
  {
    id: "#10366",
    customer: "Sarah Kim",
    total: "$84.99",
    status: "Processing",
    date: "18 Jul 2026",
    items: 2,
  },
  {
    id: "#10314",
    customer: "Marcus Reed",
    total: "$239.00",
    status: "Delivered",
    date: "05 Jul 2026",
    items: 4,
  },
];

const statusStyles: Record<string, string> = {
  Delivered: "bg-emerald-100 text-emerald-700",
  "In transit": "bg-blue-100 text-blue-700",
  Processing: "bg-amber-100 text-amber-700",
};

export default function AdminOrdersPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1400px]">
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

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total orders</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">1,284</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Pending</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">84</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Revenue</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">$84.2K</p>
          </div>
        </div>

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
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {order.id}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {order.customer}
                    </td>
                    <td className="px-5 py-4 text-slate-700">{order.date}</td>
                    <td className="px-5 py-4 text-slate-700">{order.items}</td>
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {order.total}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
