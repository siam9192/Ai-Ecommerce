import Link from "next/link";
import { FiArrowLeft, FiSearch, FiUser } from "react-icons/fi";

const customers = [
  {
    name: "Alicia Gomez",
    email: "alicia@example.com",
    orders: 14,
    totalSpent: "$2,430",
    status: "Active",
  },
  {
    name: "Daniel Lee",
    email: "daniel@example.com",
    orders: 9,
    totalSpent: "$1,640",
    status: "Active",
  },
  {
    name: "Sarah Kim",
    email: "sarah@example.com",
    orders: 6,
    totalSpent: "$980",
    status: "New",
  },
  {
    name: "Marcus Reed",
    email: "marcus@example.com",
    orders: 12,
    totalSpent: "$3,140",
    status: "VIP",
  },
];

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  New: "bg-blue-100 text-blue-700",
  VIP: "bg-violet-100 text-violet-700",
};

export default function AdminCustomersPage() {
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
            <h1 className="mt-3 text-3xl font-bold text-slate-900">
              Customers
            </h1>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-500 shadow-sm">
            <FiSearch size={16} />
            <input
              type="text"
              placeholder="Search customers"
              className="w-44 border-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-2 text-slate-900">
              <FiUser size={18} />
              <h2 className="text-xl font-bold">Customer list</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Orders</th>
                  <th className="px-5 py-3 font-medium">Total spent</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer.email}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {customer.name}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {customer.email}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {customer.orders}
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {customer.totalSpent}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[customer.status]}`}
                      >
                        {customer.status}
                      </span>
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
