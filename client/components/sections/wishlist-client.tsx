"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FiArrowRight,
  FiCheck,
  FiHeart,
  FiInfo,
  FiSearch,
  FiShoppingBag,
  FiShoppingCart,
  FiTag,
  FiTrash2,
  FiTruck,
} from "react-icons/fi";
import { addItem as addCartItem } from "@/api-services/cart.api.services";
import { clear, removeItem } from "@/api-services/wishlist.api.services";
import {
  addAppStateId,
  clearAppStateCollection,
  incrementCartItemCount,
  removeAppStateId,
} from "@/redux/features/appState-slice";
import { useAppDispatch } from "@/redux/hooks";
import ProtectedRoute from "@/components/auth/protected-route";
import AppStatePageTracker from "@/components/shared/app-state-page-tracker";
import type { Product } from "@/types/product.type";

interface WishlistClientProps {
  products: Product[];
  wishlistItemIds: number[];
}

type SortOption = "recent" | "price-low" | "price-high" | "name";

const sortLabels: Record<SortOption, string> = {
  recent: "Recently added",
  "price-low": "Price: low to high",
  "price-high": "Price: high to low",
  name: "Name: A to Z",
};

export default function WishlistClient({
  products: initialProducts,
  wishlistItemIds: initialWishlistItemIds,
}: WishlistClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [wishlistEntryIds, setWishlistEntryIds] = useState(() =>
    Object.fromEntries(
      initialProducts.map((product, index) => [
        product.id,
        initialWishlistItemIds[index],
      ]),
    ),
  );
  const [busyProductId, setBusyProductId] = useState<number | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const dispatch = useAppDispatch();
  const wishlistItemIds = useMemo(
    () => Object.values(wishlistEntryIds),
    [wishlistEntryIds],
  );

  useEffect(() => {
    setProducts(initialProducts);
    setWishlistEntryIds(
      Object.fromEntries(
        initialProducts.map((product, index) => [
          product.id,
          initialWishlistItemIds[index],
        ]),
      ),
    );
  }, [initialProducts, initialWishlistItemIds]);

  const inStockCount = products.filter(
    (product) => product.available_stock > 0,
  ).length;
  const totalValue = products.reduce(
    (total, product) => total + product.main_price,
    0,
  );
  const totalSavings = products.reduce(
    (total, product) =>
      total + Math.max(0, product.regular_price - product.main_price),
    0,
  );

  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const filtered = products.filter((product) =>
      [product.name, product.category ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch),
    );

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.main_price - b.main_price;
        case "price-high":
          return b.main_price - a.main_price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [products, search, sortBy]);

  const handleRemove = async (productId: number) => {
    setBusyProductId(productId);
    setMessage("");
    try {
      await removeItem({ product_id: productId });
      const wishlistEntryId = wishlistEntryIds[productId];
      if (wishlistEntryId !== undefined) {
        dispatch(
          removeAppStateId({
            collection: "wishlist_item_ids",
            id: wishlistEntryId,
          }),
        );
      }
      setProducts((current) =>
        current.filter((product) => product.id !== productId),
      );
      setWishlistEntryIds((current) => {
        const next = { ...current };
        delete next[productId];
        return next;
      });
      setMessage("Item removed from your wishlist.");
    } catch {
      setMessage("Unable to remove that item from your wishlist.");
    } finally {
      setBusyProductId(null);
    }
  };

  const handleAddToCart = async (product: Product) => {
    setBusyProductId(product.id);
    setMessage("");
    try {
      const response = await addCartItem({ product_id: product.id, quantity: 1 });
      dispatch(
        addAppStateId({
          collection: "cart_item_ids",
          id: response.data.id,
        }),
      );
      dispatch(incrementCartItemCount(1));
      setMessage(`${product.name} was added to your cart.`);
    } catch {
      setMessage("Unable to add that item to your cart.");
    } finally {
      setBusyProductId(null);
    }
  };

  const handleClear = async () => {
    if (products.length === 0 || isClearing) return;

    setIsClearing(true);
    setMessage("");
    try {
      await clear();
      setProducts([]);
      setWishlistEntryIds({});
      dispatch(clearAppStateCollection("wishlist_item_ids"));
      setMessage("Your wishlist is clear. There’s always something new to find.");
    } catch {
      setMessage("Unable to clear your wishlist.");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <ProtectedRoute customerOnly>
      <main className="min-h-screen bg-slate-50 pb-16">
        <AppStatePageTracker
          page="wishlist-items"
          ids={wishlistItemIds}
        />

        <section className="relative isolate overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_5%,rgba(99,102,241,0.35),transparent_38%),radial-gradient(ellipse_at_5%_100%,rgba(14,165,233,0.18),transparent_35%)]" />
          <div className="container mx-auto px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
            >
              <FiArrowRight className="rotate-180" />
              Continue shopping
            </Link>

            <div className="mt-9 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200">
                  <FiHeart />
                  Your personal collection
                </div>
                <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
                  The good things
                  <span className="block text-indigo-300">you’ve saved.</span>
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
                  Keep your favorites close, compare them at your own pace, and
                  come back whenever you’re ready.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-4 sm:min-w-56">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-400/15 text-indigo-200">
                  <FiHeart size={21} />
                </span>
                <div>
                  <p className="text-2xl font-bold">{products.length}</p>
                  <p className="text-sm text-slate-300">
                    {products.length === 1 ? "favorite saved" : "favorites saved"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {message && (
            <div
              role="status"
              className="mt-6 flex items-center gap-3 rounded-2xl border border-indigo-100 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm"
            >
              <FiInfo className="shrink-0 text-indigo-600" />
              {message}
            </div>
          )}

          <section
            aria-label="Wishlist overview"
            className="relative z-10 -mt-1 grid gap-3 pt-6 sm:grid-cols-3"
          >
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <FiShoppingBag size={19} />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Ready to shop
                </p>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  {inStockCount}{" "}
                  <span className="text-sm font-medium text-slate-500">
                    in stock
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                <FiTag size={19} />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Collection value
                </p>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  ${totalValue.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <FiCheck size={19} />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Current price savings
                </p>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  ${totalSavings.toFixed(2)}
                </p>
              </div>
            </div>
          </section>

          {products.length === 0 ? (
            <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="mx-auto max-w-xl px-6 py-14 text-center sm:py-20">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <FiHeart size={28} />
                </span>
                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600">
                  A little room for inspiration
                </p>
                <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                  Your wishlist starts here
                </h2>
                <p className="mt-3 leading-7 text-slate-600">
                  Found something you love? Save it here and you can pick up
                  right where you left off.
                </p>
                <Link
                  href="/shop"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Explore the shop <FiArrowRight />
                </Link>
              </div>
              <div className="grid border-t border-slate-100 bg-slate-50 sm:grid-cols-3">
                {[
                  ["Save your favorites", "Tap the heart on products you love."],
                  ["Compare at your pace", "Keep your picks together in one place."],
                  ["Come back anytime", "Your saved list is here when you need it."],
                ].map(([title, description]) => (
                  <div
                    key={title}
                    className="border-b border-slate-200 p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
                  >
                    <p className="font-semibold text-slate-900">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <>
              <section className="mt-10 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-600">
                    Curated by you
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    Your saved items
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {visibleProducts.length}{" "}
                    {visibleProducts.length === 1 ? "item" : "items"}
                    {search.trim() ? " match your search" : " in your collection"}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label className="relative block sm:w-64">
                    <FiSearch
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={17}
                    />
                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search saved items"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                  </label>
                  <label className="sr-only" htmlFor="wishlist-sort">
                    Sort wishlist
                  </label>
                  <select
                    id="wishlist-sort"
                    value={sortBy}
                    onChange={(event) =>
                      setSortBy(event.target.value as SortOption)
                    }
                    className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  >
                    {Object.entries(sortLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => void handleClear()}
                    disabled={isClearing}
                    className="h-11 rounded-xl px-3 text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  >
                    {isClearing ? "Clearing..." : "Clear wishlist"}
                  </button>
                </div>
              </section>

              {visibleProducts.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                  <FiSearch className="mx-auto text-slate-400" size={24} />
                  <h3 className="mt-3 font-semibold text-slate-900">
                    No saved items match “{search}”
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {visibleProducts.map((product) => {
                    const isBusy = busyProductId === product.id;
                    const discount =
                      product.regular_price > product.main_price
                        ? Math.round(
                            ((product.regular_price - product.main_price) /
                              product.regular_price) *
                              100,
                          )
                        : 0;

                    return (
                      <article
                        key={product.id}
                        className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5"
                      >
                        <div className="relative">
                          <Link
                            href={`/products/${product.slug}`}
                            className="block"
                            aria-label={`View ${product.name}`}
                          >
                            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                              {product.images[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-slate-300">
                                  <FiShoppingBag size={44} />
                                </div>
                              )}
                            </div>
                          </Link>
                          {discount > 0 && (
                            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm backdrop-blur">
                              Save {discount}%
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => void handleRemove(product.id)}
                            disabled={isBusy}
                            aria-label={`Remove ${product.name} from wishlist`}
                            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-rose-500 shadow-sm backdrop-blur transition hover:bg-rose-50 disabled:opacity-50"
                          >
                            <FiTrash2 size={16} />
                          </button>
                          <span
                            className={`absolute bottom-4 left-4 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur ${
                              product.available_stock > 0
                                ? "bg-emerald-50/95 text-emerald-700"
                                : "bg-slate-900/75 text-white"
                            }`}
                          >
                            {product.available_stock > 0
                              ? "In stock"
                              : "Currently unavailable"}
                          </span>
                        </div>

                        <div className="p-5">
                          <div className="min-h-24">
                            {product.category && (
                              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                                {product.category}
                              </p>
                            )}
                            <Link href={`/products/${product.slug}`}>
                              <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-6 text-slate-900 transition hover:text-indigo-700">
                                {product.name}
                              </h3>
                            </Link>
                            <div className="mt-3 flex items-baseline gap-2">
                              <p className="text-xl font-bold text-slate-950">
                                ${product.main_price.toFixed(2)}
                              </p>
                              {discount > 0 && (
                                <p className="text-sm text-slate-400 line-through">
                                  ${product.regular_price.toFixed(2)}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                            <button
                              type="button"
                              onClick={() => void handleAddToCart(product)}
                              disabled={isBusy || product.available_stock <= 0}
                              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                            >
                              <FiShoppingCart size={16} />
                              {isBusy ? "Working..." : "Add to cart"}
                            </button>
                            <Link
                              href={`/products/${product.slug}`}
                              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                            >
                              Details <FiArrowRight size={15} />
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              <section className="mt-10">
                <div className="mb-4">
                  <p className="text-sm font-medium text-indigo-600">
                    A better way to decide
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    Make your shortlist work for you
                  </h2>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    {
                      icon: <FiCheck />,
                      title: "Check availability",
                      description:
                        "Stock can change. Items marked in stock are ready to add to your cart.",
                    },
                    {
                      icon: <FiTag />,
                      title: "Compare the prices",
                      description:
                        "See current prices alongside regular prices to spot marked-down favorites.",
                    },
                    {
                      icon: <FiHeart />,
                      title: "Keep your picks together",
                      description:
                        "Save products as you browse, then come back here to compare your shortlist.",
                    },
                  ].map((tip) => (
                    <article
                      key={tip.title}
                      className="rounded-2xl border border-slate-200 bg-white p-5"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        {tip.icon}
                      </span>
                      <h3 className="mt-4 font-semibold text-slate-900">
                        {tip.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {tip.description}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <aside className="mt-10 grid gap-5 rounded-3xl border border-indigo-100 bg-indigo-50/70 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
                    <FiTruck />
                    A useful reminder
                  </div>
                  <h2 className="mt-2 text-xl font-bold text-slate-900">
                    Your favorites are one step from yours.
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Stock and prices can change. Check the product page for the
                    latest details before you place an order.
                  </p>
                </div>
                <Link
                  href="/shop"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-100"
                >
                  Find something new <FiArrowRight />
                </Link>
              </aside>
            </>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
