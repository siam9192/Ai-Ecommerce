"use client";

import { useEffect, useState } from "react";
import { getOrders, type Order } from "@/api-services/order.api.services";
import { getAdminOverview } from "@/api-services/overview.api.services";
import { getProducts } from "@/api-services/products.api.services";
import { getUsers } from "@/api-services/user.api.services";
import type { Product } from "@/types/product.type";
import type { User } from "@/types/user.type";
import AppStatePageTracker from "@/components/shared/app-state-page-tracker";
import { FiBox, FiDollarSign, FiShoppingBag, FiUsers } from "react-icons/fi";
import { useAppSelector } from "@/redux/hooks";

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

const emptyOverview: AdminOverview = {
  total_revenue: 0,
  products_count: 0,
  products_active: 0,
  products_in_stock: 0,
  orders_count: 0,
  customers_count: 0,
  pending_orders: 0,
};

export default function AdminDashboardPage() {
  const refreshToggle = useAppSelector(
    (state) => state.appState.state_update_toggle,
  );
  const [admin_overview, setAdminOverview] = useState(emptyOverview);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    const loadDashboard = async () => {
      try {
        const [overviewResponse] =
          await Promise.all([
            getAdminOverview(),
  
          ]);

        if (
          !overviewResponse.success 
        ) {
          throw new Error("One or more admin dashboard data requests failed.");
        }

        if (!isCurrent) return;
        setAdminOverview(overviewResponse.data);
        setError("");
      } catch (requestError) {
        console.error("Failed to load admin dashboard data:", requestError);
        if (isCurrent) {
          setError("Dashboard data could not be refreshed. Please try again.");
        }
      }
    };

    void loadDashboard();
    return () => {
      isCurrent = false;
    };
  }, [refreshToggle]);

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

 

  return (
    <>

      <div className="space-y-8">
        {error && (
          <p
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}
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
