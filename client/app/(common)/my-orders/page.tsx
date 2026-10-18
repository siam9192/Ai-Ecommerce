"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOrders, type Order } from "@/api-services/order.api.services";
import { getUserReviews } from "@/api-services/reviews.api.services";
import ProtectedRoute from "@/components/auth/protected-route";
import AppStatePageTracker from "@/components/shared/app-state-page-tracker";
import OrderReviewForm from "@/components/sections/order-review-form";
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiCheck,
  FiClock,
  FiMapPin,
  FiPackage,
  FiSearch,
  FiShoppingBag,
  FiTruck,
} from "react-icons/fi";
import { useAppSelector } from "@/redux/hooks";

type OrderFilter = "all" | "pending" | "processing" | "delivered";

const statusStyles: Record<string, { badge: string; icon: typeof FiClock }> = {
  pending: {
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    icon: FiClock,
  },
  processing: {
    badge: "border-blue-200 bg-blue-50 text-blue-700",
    icon: FiPackage,
  },
  delivered: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: FiCheck,
  },
};

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function OrderProgress({ status }: { status: string }) {
  const stages = ["Ordered", "Processing", "Delivered"];
  const currentStage =
    status === "delivered" ? 2 : status === "processing" ? 1 : 0;

  return (
    <div
      className="mt-6 hidden items-center sm:flex"
      aria-label={`Order ${formatStatus(status)}`}
    >
      {stages.map((stage, index) => {
        const isComplete = index <= currentStage;
        return (
          <div
            key={stage}
            className={`flex min-w-0 items-center ${
              index < stages.length - 1 ? "flex-1" : ""
            }`}
          >
            <div className="flex shrink-0 items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                  isComplete
                    ? "bg-primary text-white"
                    : "border border-slate-200 bg-white text-slate-400"
                }`}
              >
                {isComplete ? <FiCheck size={14} /> : index + 1}
              </span>
              <span
                className={`text-xs font-medium ${
                  isComplete ? "text-slate-700" : "text-slate-400"
                }`}
              >
                {stage}
              </span>
            </div>
            {index < stages.length - 1 && (
              <span
                className={`mx-3 h-px flex-1 ${
                  index < currentStage ? "bg-primary/50" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function MyOrdersPage() {
  const refreshToggle = useAppSelector(
    (state) => state.appState.state_update_toggle,
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviewedProductIds, setReviewedProductIds] = useState<Set<number>>(
    new Set(),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewLoadError, setReviewLoadError] = useState("");
  const [activeFilter, setActiveFilter] = useState<OrderFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isCurrent = true;

    const loadOrders = async () => {
      setLoading(true);
      try {
        const response = await getOrders();
        if (!response.success) {
          throw new Error("Customer orders request failed.");
        }
        if (!isCurrent) return;
        setOrders(response.data);
        setError("");

        const customerId = response.data[0]?.customer_id;
        if (customerId !== undefined) {
          try {
            const reviewsResponse = await getUserReviews(customerId);
            if (!reviewsResponse.success) {
              throw new Error(
                reviewsResponse.message || "Customer reviews request failed.",
              );
            }
            if (!isCurrent) return;
            setReviewedProductIds(
              new Set(reviewsResponse.data.map((review) => review.product_id)),
            );
            setReviewLoadError("");
          } catch (reviewError) {
            console.error("Failed to load customer reviews:", reviewError);
            if (isCurrent) {
              setReviewLoadError(
                "We couldn't check your existing reviews. You can still submit a review; products you've reviewed may be rejected.",
              );
            }
          }
        }
      } catch (requestError) {
        console.error("Failed to load customer orders:", requestError);
        if (isCurrent) {
          setError("Orders are temporarily unavailable. Please try again shortly.");
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    void loadOrders();
    return () => {
      isCurrent = false;
    };
  }, [refreshToggle]);

  const handleReviewSubmitted = (productId: number) => {
    setReviewedProductIds((currentIds) => new Set(currentIds).add(productId));
  };

  const filteredOrders = orders.filter((order) => {
    const status = order.status.toLowerCase();
    const matchesFilter = activeFilter === "all" || status === activeFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query.length === 0 ||
      `${order.id} ${status} ${order.items
        .map((item) => item.product.name)
        .join(" ")} ${order.delivery_address.city}`
        .toLowerCase()
        .includes(query);
    return matchesFilter && matchesSearch;
  });
  const deliveredCount = orders.filter(
    (order) => order.status.toLowerCase() === "delivered",
  ).length;
  const inProgressCount = orders.filter(
    (order) => order.status.toLowerCase() !== "delivered",
  ).length;
  const totalSpent = orders.reduce((total, order) => total + order.total_price, 0);

  return (
    <ProtectedRoute customerOnly>
      <main className="min-h-screen bg-slate-50/80 pb-16">
        <AppStatePageTracker
          page="customer-orders"
          ids={orders.map((order) => order.id)}
        />
        <section className="relative isolate overflow-hidden bg-slate-950">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.38),_transparent_55%)]" />
          <div className="absolute -right-20 -top-36 -z-10 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -right-8 -top-24 -z-10 h-56 w-56 rounded-full border border-white/10" />
          <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
              <div>
                <Link
                  href="/shop"
                  className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
                >
                  <FiArrowLeft size={15} />
                  Back to shopping
                </Link>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-300">
                  Your account
                </p>
                <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  My orders
                </h1>
                <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300 sm:text-base">
                  Track deliveries, revisit your purchases, and tell us what you
                  think about the things you love.
                </p>
              </div>
              <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-4 text-white shadow-xl shadow-black/10 backdrop-blur">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-400/15 text-indigo-200">
                  <FiShoppingBag size={21} />
                </span>
                <span>
                  <span className="block text-2xl font-bold leading-none">
                    {orders.length}
                  </span>
                  <span className="mt-1 block text-xs text-slate-300">
                    {orders.length === 1 ? "order placed" : "orders placed"}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <section
            aria-label="Order summary"
            className="-mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
          >
            {[
              {
                label: "Total spent",
                value: `$${totalSpent.toFixed(2)}`,
                icon: FiShoppingBag,
                tone: "bg-indigo-50 text-indigo-600",
              },
              {
                label: "Delivered",
                value: deliveredCount.toString(),
                icon: FiCheck,
                tone: "bg-emerald-50 text-emerald-600",
              },
              {
                label: "Open orders",
                value: inProgressCount.toString(),
                icon: FiTruck,
                tone: "bg-sky-50 text-sky-600",
              },
            ].map(({ label, value, icon: Icon, tone }) => (
              <div
                key={label}
                className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.03]"
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}
                >
                  <Icon size={19} />
                </span>
                <span>
                  <span className="block text-xl font-bold text-slate-900">
                    {value}
                  </span>
                  <span className="mt-0.5 block text-xs font-medium text-slate-500">
                    {label}
                  </span>
                </span>
              </div>
            ))}
          </section>

          <section className="mt-10">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Purchase history
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                  Your purchases
                </h2>
              </div>
              <label className="relative block w-full sm:max-w-xs">
                <FiSearch
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search orders or products"
                  aria-label="Search orders or products"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </label>
            </div>

            <div
              className="mb-5 flex gap-2 overflow-x-auto pb-1"
              role="group"
              aria-label="Filter orders by status"
            >
              {(
                [
                  ["all", "All orders"],
                  ["pending", "Pending"],
                  ["processing", "Processing"],
                  ["delivered", "Delivered"],
                ] as const
              ).map(([filter, label]) => {
                const count =
                  filter === "all"
                    ? orders.length
                    : orders.filter(
                        (order) => order.status.toLowerCase() === filter,
                      ).length;
                const selected = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    aria-pressed={selected}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      selected
                        ? "bg-slate-900 text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                    }`}
                  >
                    {label}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                        selected
                          ? "bg-white/15 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {error && (
              <p
                className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {error}
              </p>
            )}
            {reviewLoadError && (
              <p
                className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
                role="status"
              >
                {reviewLoadError}
              </p>
            )}

            {loading && orders.length === 0 ? (
              <div className="space-y-4" aria-label="Loading your orders">
                {[1, 2].map((skeleton) => (
                  <div
                    key={skeleton}
                    className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
                  >
                    <div className="h-4 w-32 rounded bg-slate-200" />
                    <div className="mt-4 h-6 w-48 rounded bg-slate-100" />
                    <div className="mt-6 h-16 rounded-xl bg-slate-100" />
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white text-center shadow-sm">
                <div className="bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.12),_transparent_65%)] px-6 py-14 sm:py-16">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-primary shadow-inner">
                    <FiShoppingBag size={28} />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-slate-900">
                    Your next favorite is waiting
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    Once you place an order, you can follow its journey right
                    here.
                  </p>
                  <Link
                    href="/shop"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary-hover"
                  >
                    Explore the shop
                    <FiArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                <FiSearch className="mx-auto text-slate-400" size={24} />
                <h3 className="mt-3 font-semibold text-slate-900">
                  No matching orders
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Try another search or choose a different status.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("all");
                  }}
                  className="mt-4 text-sm font-semibold text-primary hover:text-primary-hover"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const status = order.status.toLowerCase();
                  const statusStyle = statusStyles[status];
                  const StatusIcon = statusStyle?.icon ?? FiPackage;
                  return (
                    <article
                      key={order.id}
                      className="group overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm shadow-slate-900/[0.025] transition duration-200 hover:border-slate-300 hover:shadow-md"
                    >
                      <div className="p-5 sm:p-6">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                          <div className="flex items-start gap-3">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-primary">
                              <FiPackage size={20} />
                            </span>
                            <div>
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                <h3 className="font-bold text-slate-900">
                                  Order #{order.id}
                                </h3>
                                <span className="text-slate-300">·</span>
                                <span className="text-sm text-slate-500">
                                  {formatDate(order.created_at)}
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-slate-500">
                                {order.items.length}{" "}
                                {order.items.length === 1 ? "item" : "items"} in
                                this order
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-4 sm:justify-end">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                                statusStyle?.badge ??
                                "border-slate-200 bg-slate-50 text-slate-700"
                              }`}
                            >
                              <StatusIcon size={13} />
                              {formatStatus(order.status)}
                            </span>
                            <span className="text-xl font-bold tracking-tight text-slate-900">
                              ${order.total_price.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <OrderProgress status={status} />

                        <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 md:grid-cols-[1fr_auto] md:items-end">
                          <div>
                            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                              In this order
                            </p>
                            <ul className="divide-y divide-slate-100">
                              {order.items.map((item) => (
                                <li
                                  key={item.id}
                                  className="flex flex-col justify-between gap-2 py-3 first:pt-1 last:pb-1 sm:flex-row sm:items-center sm:gap-5"
                                >
                                  <div className="flex min-w-0 items-center gap-3">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                      <FiShoppingBag size={17} />
                                    </span>
                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-semibold text-slate-800">
                                        {item.product.name}
                                      </p>
                                      <p className="mt-0.5 text-xs text-slate-500">
                                        Qty {item.quantity} · $
                                        {item.per_price.toFixed(2)} each
                                      </p>
                                    </div>
                                  </div>
                                  <div className="pl-[52px] sm:pl-0">
                                    <OrderReviewForm
                                      productId={item.product_id}
                                      productName={item.product.name}
                                      reviewed={reviewedProductIds.has(
                                        item.product_id,
                                      )}
                                      canReview={true}
                                      onSubmitted={handleReviewSubmitted}
                                    />
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-3 text-xs text-slate-600 md:max-w-52">
                            <FiMapPin
                              size={15}
                              className="shrink-0 text-slate-400"
                            />
                            <span className="min-w-0 truncate">
                              {order.delivery_address.city},{" "}
                              {order.delivery_address.state}
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <Link
            href="/shop"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-primary"
          >
            <FiArrowLeft size={16} />
            Continue shopping
          </Link>
        </div>
      </main>
    </ProtectedRoute>
  );
}
