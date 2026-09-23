"use client";

import Link from "next/link";
import { useState } from "react";
import { FiHeart, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { addItem as addCartItem } from "@/api-services/cart.api.services";
import { clear, removeItem } from "@/api-services/wishlist.api.services";
import ProtectedRoute from "@/components/auth/protected-route";
import AppStatePageTracker from "@/components/shared/app-state-page-tracker";
import type { Product } from "@/types/product.type";

interface WishlistClientProps {
  products: Product[];
  wishlistItemIds: number[];
}

export default function WishlistClient({
  products: initialProducts,
  wishlistItemIds,
}: WishlistClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [busyProductId, setBusyProductId] = useState<number | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [message, setMessage] = useState("");

  const handleRemove = async (productId: number) => {
    setBusyProductId(productId);
    setMessage("");
    try {
      await removeItem({ product_id: productId });
      setProducts((current) =>
        current.filter((product) => product.id !== productId),
      );
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
      await addCartItem({ product_id: product.id, quantity: 1 });
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
    } catch {
      setMessage("Unable to clear your wishlist.");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <ProtectedRoute customerOnly>
      <main className="container mx-auto min-h-screen px-4 py-10 sm:px-6 lg:px-8">
        <AppStatePageTracker page="wishlist-items" ids={wishlistItemIds} />
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              Saved items
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              My wishlist
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <FiHeart size={16} />
              {products.length} saved
            </div>
            {products.length > 0 && (
              <button
                type="button"
                onClick={() => void handleClear()}
                disabled={isClearing}
                className="text-sm font-medium text-red-500 transition hover:text-red-600 disabled:opacity-50"
              >
                {isClearing ? "Clearing..." : "Clear all"}
              </button>
            )}
          </div>
        </div>

        {message && (
          <p className="mb-6 rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary">
            {message}
          </p>
        )}

        {products.length === 0 ? (
          <div className="rounded-2xl border border-border bg-muted p-12 text-center">
            <FiHeart className="mx-auto text-primary" size={32} />
            <h2 className="mt-4 text-xl font-semibold text-foreground">
              Your wishlist is empty
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Save products you love and find them here later.
            </p>
            <Link
              href="/shop"
              className="mt-5 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => {
              const isBusy = busyProductId === product.id;
              return (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
                >
                  <Link href={`/products/${product.slug}`} className="block">
                    <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    </div>
                  </Link>
                  <div className="space-y-4 p-4">
                    <div>
                      <Link href={`/products/${product.slug}`}>
                        <h2 className="line-clamp-2 text-base font-semibold text-slate-900 hover:text-primary">
                          {product.name}
                        </h2>
                      </Link>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        ${product.main_price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => void handleAddToCart(product)}
                        disabled={isBusy || product.available_stock <= 0}
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-50"
                      >
                        <FiShoppingCart size={16} />
                        {isBusy ? "Working..." : "Add to cart"}
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleRemove(product.id)}
                        disabled={isBusy}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                        aria-label={`Remove ${product.name} from wishlist`}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
