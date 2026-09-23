import Link from "next/link";
import { productService } from "@/api-services/products.api.services";
import { getWishlist } from "@/api-services/wishlist.api.services";
import WishlistClient from "@/components/sections/wishlist-client";
import { FiArrowLeft } from "react-icons/fi";

export default async function WishlistPage() {
  try {
    const [wishlistResponse, productsResponse] = await Promise.all([
      getWishlist(),
      productService.searchProducts(),
    ]);

    const wishlistProductIds = new Set(
      wishlistResponse.data.map((item) => item.product_id),
    );
    const products = productsResponse.data.filter((product) =>
      wishlistProductIds.has(product.id),
    );

    return (
      <WishlistClient
        products={products}
        wishlistItemIds={wishlistResponse.data.map((item) => item.id)}
      />
    );
  } catch {
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
          <p className="mt-2 text-sm text-red-700">
            Please sign in or try again in a moment.
          </p>
        </div>
      </main>
    );
  }
}
