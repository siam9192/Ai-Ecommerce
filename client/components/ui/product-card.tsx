"use client";

import { Product } from "@/types/product.type";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/features/cart-slice";
import { addItem } from "@/api-services/cart.api.services";
import {
  addItem as addWishlistItem,
  removeItem as removeWishlistItem,
} from "@/api-services/wishlist.api.services";
interface Props {
  product: Product;
}
function ProductCard({ product }: Props) {
  const [isAdding, setIsAdding] = React.useState(false);
  const [addError, setAddError] = React.useState("");
  const [isWishlisted, setIsWishlisted] = React.useState(product.wish_listed);
  const [isUpdatingWishlist, setIsUpdatingWishlist] = React.useState(false);
  const dispatch = useDispatch();
  const hasStock = product.available_stock > 0;

  const handleAddToCart = async () => {
    if (!hasStock || isAdding) return;

    setIsAdding(true);
    setAddError("");

    try {
      await addItem({ product_id: product.id, quantity: 1 });

      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.main_price,
          image: product.images[0],
          quantity: 1,
          inStock: hasStock,
        }),
      );
    } catch {
      setAddError("Unable to add this product to your cart.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (isUpdatingWishlist) return;

    setIsUpdatingWishlist(true);
    try {
      if (isWishlisted) {
        await removeWishlistItem({ product_id: product.id });
        setIsWishlisted(false);
      } else {
        await addWishlistItem({ product_id: product.id });
        setIsWishlisted(true);
      }
    } catch {
      setAddError("Unable to update your wishlist.");
    } finally {
      setIsUpdatingWishlist(false);
    }
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-card transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <button
            type="button"
            onClick={handleWishlistToggle}
            disabled={isUpdatingWishlist}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={
              isWishlisted
                ? `Remove ${product.name} from wishlist`
                : `Add ${product.name} to wishlist`
            }
          >
            <FiHeart
              size={18}
              className={isWishlisted ? "fill-red-500 text-red-500" : undefined}
            />
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2 flex items-center gap-1 text-sm">
          <div className="flex" aria-label={`${product.rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, index) => (
              <FiStar
                key={index}
                size={15}
                className={
                  index < Math.round(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }
              />
            ))}
          </div>
          <span className="font-medium">{product.rating}</span>
        </div>

        {product.category && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
            {product.category}
          </p>
        )}

        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-1 text-base font-semibold text-foreground transition hover:text-primary">
            {product.name}
          </h3>
        </Link>

        {/* Price + Cart */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-foreground">
              ${product.main_price.toFixed(2)}
            </span>
            {product.regular_price > product.main_price && (
              <span className="ml-2 text-sm text-muted-foreground line-through">
                ${product.regular_price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!hasStock || isAdding}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={
              hasStock
                ? `Add ${product.name} to cart`
                : `${product.name} is out of stock`
            }
          >
            {isAdding ? "..." : <FiShoppingCart size={18} />}
          </button>
        </div>

        {addError && (
          <p className="mt-2 text-xs font-medium text-red-600">{addError}</p>
        )}

        <p
          className={`mt-2 text-xs font-medium ${
            hasStock ? "text-green-600" : "text-red-600"
          }`}
        >
          {hasStock ? `${product.available_stock} available` : "Out of stock"}
        </p>
      </div>
    </div>
  );
}

export default ProductCard;
