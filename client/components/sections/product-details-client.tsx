"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import ProductImageGallery from "@/components/sections/product-image-gallery";
import ReviewsSection from "@/components/sections/reviews-section";
import {
  FiStar,
  FiShoppingCart,
  FiHeart,
  FiArrowLeft,
  FiCheck,
} from "react-icons/fi";
import { addToCart } from "@/redux/features/cart-slice";
import { addItem } from "@/api-services/cart.api.services";
import {
  addItem as addWishlistItem,
  removeItem as removeWishlistItem,
} from "@/api-services/wishlist.api.services";
import type { Product } from "@/types/product.type";

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({
  product,
}: ProductDetailsClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartError, setCartError] = useState("");
  const [isInCart, setIsInCart] = useState(product.cart_listed);
  const [isWishlisted, setIsWishlisted] = useState(product.wish_listed);
  const [isUpdatingWishlist, setIsUpdatingWishlist] = useState(false);
  const [wishlistError, setWishlistError] = useState("");
  const dispatch = useDispatch();

  const handleAddToCart = async () => {
    if (!hasStock || isAddingToCart) return;

    setIsAddingToCart(true);
    setCartError("");

    try {
      await addItem({ product_id: product.id, quantity });
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.main_price,
          image: product.images[0],
          quantity,
          inStock: true,
        }),
      );
      setIsInCart(true);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch {
      setCartError("Unable to add this product to your cart.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= product.available_stock) {
      setQuantity(value);
    }
  };

  const handleWishlistToggle = async () => {
    if (isUpdatingWishlist) return;

    setIsUpdatingWishlist(true);
    setWishlistError("");
    try {
      if (isWishlisted) {
        await removeWishlistItem({ product_id: product.id });
        setIsWishlisted(false);
      } else {
        await addWishlistItem({ product_id: product.id });
        setIsWishlisted(true);
      }
    } catch {
      setWishlistError("Unable to update your wishlist.");
    } finally {
      setIsUpdatingWishlist(false);
    }
  };

  const hasStock = product.available_stock > 0;
  const stockStatus = hasStock ? "In Stock" : "Out of Stock";
  const stockColor = hasStock ? "text-green-600" : "text-red-600";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href="/products"
          className="mb-8 inline-flex items-center gap-2 text-primary hover:text-primary/80 transition"
        >
          <FiArrowLeft size={20} />
          Back to Products
        </Link>

        {/* Main Content */}
        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <ProductImageGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            {/* Category */}
            {product.category && (
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
                {product.category}
              </p>
            )}

            {/* Title */}
            <h1 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar
                      key={i}
                      size={18}
                      className={
                        i < Math.round(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }
                    />
                  ))}
                </div>
                <span className="font-semibold text-foreground">
                  {product.rating}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviews?.length || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6 border-b border-border pb-6">
              <div className="flex items-end gap-3">
                <p className="text-4xl font-bold text-foreground">
                  ${product.main_price.toFixed(2)}
                </p>
                {product.regular_price > product.main_price && (
                  <p className="pb-1 text-lg text-muted-foreground line-through">
                    ${product.regular_price.toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="mb-3 font-semibold text-foreground">
                About this product
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock Status */}
            <div className="mb-8 flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  hasStock ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className={`font-medium ${stockColor}`}>{stockStatus}</span>
              {hasStock && (
                <span className="text-sm text-muted-foreground">
                  ({product.available_stock} available)
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="mb-3 block font-semibold text-foreground">
                Quantity
              </label>
              <div className="flex items-center gap-3 w-fit">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1 || !hasStock}
                  className="rounded-lg border border-border px-3 py-2 text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.available_stock}
                  value={quantity}
                  onChange={(e) =>
                    handleQuantityChange(parseInt(e.target.value) || 1)
                  }
                  className="w-16 rounded-lg border border-border bg-background px-3 py-2 text-center text-foreground"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.available_stock || !hasStock}
                  className="rounded-lg border border-border px-3 py-2 text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!hasStock || isAddingToCart}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition ${
                  addedToCart
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                {addedToCart ? (
                  <>
                    <FiCheck size={20} />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <FiShoppingCart size={20} />
                    {isInCart ? "Add More to Cart" : "Add to Cart"}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleWishlistToggle}
                disabled={isUpdatingWishlist}
                className={`rounded-lg border px-6 py-3 transition flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                  isWishlisted
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-border text-foreground hover:bg-muted"
                }`}
                aria-label={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <FiHeart
                  size={20}
                  className={isWishlisted ? "fill-current" : undefined}
                />
              </button>
            </div>

            {cartError && (
              <p className="mt-3 text-sm text-red-600">{cartError}</p>
            )}
            {wishlistError && (
              <p className="mt-3 text-sm text-red-600">{wishlistError}</p>
            )}

            <p className="mt-6 text-xs text-muted-foreground">
              Added {new Date(product.created_at).toLocaleDateString()}
              {product.updated_at !== product.created_at &&
                ` - Updated ${new Date(product.updated_at).toLocaleDateString()}`}
            </p>

            {/* Features List */}
            <div className="mt-8 border-t border-border pt-8">
              <h3 className="mb-4 font-semibold text-foreground">
                Key Features
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Premium quality materials and craftsmanship
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Trusted by thousands of customers
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Fast and reliable shipping
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  30-day money-back guarantee
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewsSection
          reviews={product.reviews}
          productRating={product.rating}
        />
      </div>
    </div>
  );
}
