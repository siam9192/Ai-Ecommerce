"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getWishlist } from "@/api-services/wishlist.api.services";
import WishlistClient from "@/components/sections/wishlist-client";
import { FiArrowLeft } from "react-icons/fi";
import { useAppSelector } from "@/redux/hooks";
import type { Product } from "@/types/product.type";

export default function WishlistPage() {
  const refreshToggle = useAppSelector(
    (state) => state.appState.state_update_toggle,
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlistItemIds, setWishlistItemIds] = useState<number[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    const loadWishlist = async () => {
      try {
        const response = await getWishlist();
        if (!response.success) {
          throw new Error("Wishlist request failed.");
        }
        if (!isCurrent) return;
        setProducts(response.data.map((item) => item.product));
        setWishlistItemIds(response.data.map((item) => item.id));
        setError("");
      } catch (requestError) {
        console.error("Failed to load wishlist:", requestError);
        if (isCurrent) {
          setError("Please sign in or try again in a moment.");
        }
      } finally {
        if (isCurrent) setHasLoaded(true);
      }
    };

    void loadWishlist();
    return () => {
      isCurrent = false;
    };
  }, [refreshToggle]);

  if (!hasLoaded && !error) {
    return (
      <main className="container mx-auto min-h-screen px-4 py-12 sm:px-6 lg:px-8">
        <p className="py-16 text-center text-sm text-slate-500">
          Loading your wishlist...
        </p>
      </main>
    );
  }

  if (error && products.length === 0) {
    return (
      <main className="container mx-auto min-h-screen px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary transition hover:text-primary/80"
        >
          <FiArrowLeft size={18} />
          Back to home
        </Link>
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
          <h1 className="text-2xl font-bold text-red-900">
            Wishlist unavailable
          </h1>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <>
      {error && (
        <p
          className="container mx-auto mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800"
          role="alert"
        >
          {error}
        </p>
      )}
      <WishlistClient products={products} wishlistItemIds={wishlistItemIds} />
    </>
  );
}
