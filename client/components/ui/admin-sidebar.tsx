"use client"
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiBarChart2,
  FiBox,
  FiCreditCard,

  FiHome,
  FiPackage,
  FiSettings,

  FiUsers,
} from "react-icons/fi";

const sideNav = [
  { label: "Overview", icon: FiHome, path:"/admin", active: true },
  { label: "Orders",path:"/admin/orders",icon: FiPackage },
  { label: "Products",path:"/admin/products", icon: FiBox },
  { label: "Customers",path:"/admin/customers",icon: FiUsers },
//   { label: "Payments",path:"/admin/payments", icon: FiCreditCard },
//   { label: "Reports", icon: FiBarChart2 },
//   { label: "Settings", icon: FiSettings },
];


function AdminSidebar() {
    const navigate = useRouter()
    const pathname = usePathname ()
  return (
      <aside className="hidden w-72 shrink-0 rounded-[28px] bg-slate-950 p-5 text-white lg:block">
          <div className="mb-8">
            <Link
              href="/"
              className="text-2xl font-black tracking-tight text-white"
            >
              AI<span className="text-primary">Shop</span>
            </Link>
          </div>

          <nav className="space-y-2">
            {sideNav.map(({ label,path, icon: Icon }) => (
              <button
                key={label}
                type="button"
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition ${
                  pathname === path
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
                onClick={()=> path ? navigate.push(path): null}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-10 rounded-[24px] bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Store health
            </p>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-white">94%</p>
                <p className="mt-1 text-sm text-slate-400">Performance score</p>
              </div>
              <div className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-300">
                +6.2%
              </div>
            </div>
          </div>
        </aside>
  )
}

export default AdminSidebar