import Link from "next/link";
import { FiPackage, FiTruck } from "react-icons/fi";

const orders = [
  {
    id: "#10482",
    date: "12 Aug 2026",
    status: "Delivered",
    amount: 429.99,
    items: ["Sony WH-1000XM5", "USB-C Cable"],
  },
  {
    id: "#10417",
    date: "02 Aug 2026",
    status: "In transit",
    amount: 129.95,
    items: ["JBL Flip 6 Speaker"],
  },
  {
    id: "#10366",
    date: "18 Jul 2026",
    status: "Processing",
    amount: 84.99,
    items: ["Keychron Keyboard"],
  },
];

const statusStyles: Record<string, string> = {
  Delivered: "bg-emerald-100 text-emerald-700",
  "In transit": "bg-blue-100 text-blue-700",
  Processing: "bg-amber-100 text-amber-700",
};

export default function MyOrdersPage() {
  return (
    <main className="container mx-auto min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Order history
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">My orders</h1>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <FiPackage size={16} />
          {orders.length} orders
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-slate-500">Order {order.id}</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {order.date}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status]}`}
                >
                  {order.status}
                </span>
                <span className="text-lg font-bold text-slate-900">
                  ${order.amount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Items</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {order.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600">
                  <FiTruck size={15} />
                  Tracking available
                </div>

                <Link
                  href="/"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-primary hover:text-primary"
                >
                  View details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
