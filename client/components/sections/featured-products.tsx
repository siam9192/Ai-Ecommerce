import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiShoppingCart, FiStar } from "react-icons/fi";
import { products } from "@/data/products";


function FeaturedProducts() {
  const featuredProducts = products.slice(0, 8);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              Featured
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Featured Products
            </h2>

            <p className="mt-2 text-muted-foreground font-secondary">
              Discover our most popular products.
            </p>
          </div>

          <Link
            href="/products"
            className="hidden items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary-hover sm:flex"
          >
            View All
            <FiArrowRight size={17} />
          </Link>
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <div
              key={product.name}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Image */}
              <Link
                href={`/products/${product.name
                  .toLowerCase()
                  .replaceAll(" ", "-")}`}
                className="block"
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>

              {/* Content */}
              <div className="p-4">
                <div className="mb-2 flex items-center gap-1 text-sm">
                  <FiStar
                    size={15}
                    className="fill-yellow-400 text-yellow-400"
                  />
                  <span className="font-medium">{product.rating}</span>
                </div>

                <Link href="/products">
                  <h3 className="line-clamp-1 text-base font-semibold text-foreground transition hover:text-primary">
                    {product.name}
                  </h3>
                </Link>

                <p className="mt-1 line-clamp-2 min-h-10 text-sm text-muted-foreground">
                  {product.description}
                </p>

                {/* Price + Cart */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-bold text-foreground">
                    ${product.price}
                  </span>

                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:bg-primary-hover"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <FiShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/products"
            className="flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold transition hover:border-primary hover:text-primary"
          >
            View All Products
            <FiArrowRight size={17} />
          </Link>
        </div>

      </div>
    </section>
  );
}

export default FeaturedProducts;