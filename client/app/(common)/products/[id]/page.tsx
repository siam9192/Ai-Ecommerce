import Link from "next/link";
import ProductDetailsClient from "@/components/sections/product-details-client"
import { FiArrowLeft } from "react-icons/fi";
import { getProductBySlug } from "@/api-services/products.api.services";
import { getProductReviews } from "@/api-services/reviews.api.services";
import type { ProductReview } from "@/types/review.type";

interface ProductDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { id } = await params;

  const response = await getProductBySlug(id);
  const product = response.success ? response.data : undefined;

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

  let reviews: ProductReview[] = [];
  let reviewsUnavailable = false;
  try {
    const reviewResponse = await getProductReviews(product.id);
    if (reviewResponse.success) {
      reviews = reviewResponse.data;
    } else {
      reviewsUnavailable = true;
    }
  } catch {
    reviewsUnavailable = true;
  }
  const productRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length
      : 0;

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
      price: product.main_price,
      priceCurrency: "USD",
      availability: product.available_stock > 0 ? "InStock" : "OutOfStock",
    },
    ...(reviews.length > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: productRating,
        reviewCount: reviews.length,
      },
    }),
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Product Details Client Component */}
      <ProductDetailsClient
        product={product}
        reviews={reviews}
        productRating={productRating}
        reviewsUnavailable={reviewsUnavailable}
      />
    </>
  );
}
