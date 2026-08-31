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
import type { Product } from "@/types/product.type";

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({
  product,
}: ProductDetailsClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          quantity: 1,
        }),
      );
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const stockStatus = product.stock > 0 ? "In Stock" : "Out of Stock";
  const stockColor = product.stock > 0 ? "text-green-600" : "text-red-600";

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
              <p className="text-4xl font-bold text-foreground">
                ${product.price.toFixed(2)}
              </p>
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
                  product.stock > 0 ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className={`font-medium ${stockColor}`}>{stockStatus}</span>
              {product.stock > 0 && (
                <span className="text-sm text-muted-foreground">
                  ({product.stock} available)
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
                  disabled={quantity <= 1 || product.stock === 0}
                  className="rounded-lg border border-border px-3 py-2 text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) =>
                    handleQuantityChange(parseInt(e.target.value) || 1)
                  }
                  className="w-16 rounded-lg border border-border bg-background px-3 py-2 text-center text-foreground"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock || product.stock === 0}
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
                disabled={product.stock === 0}
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
                    Add to Cart
                  </>
                )}
              </button>
              <button className="rounded-lg border border-border px-6 py-3 text-foreground hover:bg-muted transition flex items-center justify-center gap-2">
                <FiHeart size={20} />
              </button>
            </div>

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
