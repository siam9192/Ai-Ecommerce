import Link from "next/link";
import { products } from "@/data/products";
import ProductDetailsClient from "@/components/sections/product-details-client";
import { FiArrowLeft } from "react-icons/fi";
import type { Metadata } from "next";

interface ProductDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { id } = await params;

  const product = products.find((p) => p.slug === id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Link
          href="/products"
          className="mb-8 inline-flex items-center gap-2 text-primary hover:text-primary/80 transition"
        >
          <FiArrowLeft size={20} />
          Back to Products
        </Link>
        <div className="rounded-lg bg-muted p-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Product Not Found
          </h1>
          <p className="text-muted-foreground mb-4">
            The product you're looking for doesn't exist.
          </p>
          <Link
            href="/products"
            className="inline-block rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90 transition"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  // Structured data for SEO (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.category,
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: product.stock > 0 ? "InStock" : "OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews?.length || 0,
    },
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Product Details Client Component */}
      <ProductDetailsClient product={product} />
    </>
  );
}
