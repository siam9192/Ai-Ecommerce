import AdminSidebar from "@/components/ui/admin-sidebar";
import Link from "next/link";
import { ReactNode } from "react";
import {
  FiBarChart2,
  FiBox,
  FiCreditCard,
  FiDollarSign,
  FiHome,
  FiPackage,
  FiSettings,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";

const overviewCards = [
  {
    label: "Revenue",
    value: "$84.2K",
    change: "+18.4%",
    icon: FiDollarSign,
    tone: "bg-violet-100 text-violet-600",
  },
  {
    label: "Orders",
    value: "1,284",
    change: "+9.1%",
    icon: FiShoppingBag,
    tone: "bg-emerald-100 text-emerald-600",
  },
  {
    label: "Customers",
    value: "8,420",
    change: "+12.6%",
    icon: FiUsers,
    tone: "bg-blue-100 text-blue-600",
  },
  {
    label: "Products",
    value: "1,962",
    change: "+4.3%",
    icon: FiBox,
    tone: "bg-amber-100 text-amber-600",
  },
];

const recentOrders = [
  {
    id: "#10482",
    customer: "Alicia Gomez",
    total: "$429.99",
    status: "Delivered",
    date: "12 Aug",
  },
  {
    id: "#10417",
    customer: "Daniel Lee",
    total: "$129.95",
    status: "In transit",
    date: "02 Aug",
  },
  {
    id: "#10366",
    customer: "Sarah Kim",
    total: "$84.99",
    status: "Processing",
    date: "18 Jul",
  },
  {
    id: "#10314",
    customer: "Marcus Reed",
    total: "$239.00",
    status: "Delivered",
    date: "05 Jul",
  },
];

const topProducts = [
  { name: "Sony WH-1000XM5", sales: 312, revenue: "$124,800" },
  { name: "Apple Watch Series 9", sales: 268, revenue: "$107,200" },
  { name: "Canon EOS R6 Mark II", sales: 143, revenue: "$357,500" },
  { name: "Keychron K2", sales: 198, revenue: "$16,800" },
];

export default function AdminDashboardPage() {

  return (
  
      <div>
         
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
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-primary hover:text-primary"
                >
                  Export report
                </button>
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
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {value}
                </p>
              </div>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  Revenue overview
                </h2>
                <span className="text-sm text-slate-500">Last 7 days</span>
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
                  <div
                    key={product.name}
                    className="rounded-2xl bg-slate-50 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {product.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {product.sales} sales
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
              <h2 className="text-xl font-bold text-slate-900">
                Recent orders
              </h2>
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
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-slate-100 last:border-b-0"
                    >
                      <td className="py-3 pr-4 font-semibold text-slate-900">
                        {order.id}
                      </td>
                      <td className="py-3 pr-4 text-slate-700">
                        {order.customer}
                      </td>
                      <td className="py-3 pr-4 text-slate-700">{order.date}</td>
                      <td className="py-3 pr-4 font-medium text-slate-900">
                        {order.total}
                      </td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            order.status === "Delivered"
                              ? "bg-emerald-100 text-emerald-700"
                              : order.status === "In transit"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
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
    
  );
}
