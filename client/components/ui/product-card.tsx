import { Product } from "@/types/product.type";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FiShoppingCart, FiStar } from "react-icons/fi";
interface Props {
  product: Product;
}
function ProductCard({ product }: Props) {
  return (
    <div
      key={product.name}
      className="group overflow-hidden rounded-2xl border border-border bg-card transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Image */}
      <Link
        href={`/products/${product.name.toLowerCase().replaceAll(" ", "-")}`}
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
          <FiStar size={15} className="fill-yellow-400 text-yellow-400" />
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
  );
}

export default ProductCard;
