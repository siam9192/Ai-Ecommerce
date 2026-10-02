import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import ProductCard from "../ui/product-card";
import AppStatePageTracker from "@/components/shared/app-state-page-tracker";
import { getFeaturedProducts } from "@/api-services/products.api.services";

async function FeaturedProducts() {
  const res = await getFeaturedProducts();
  const products = res.data;

  return (
    <section className="py-16">
      <AppStatePageTracker
        page="featured"
        ids={products.map((product) => product.id)}
      />
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
          {products.map((product, key) => (
            <ProductCard product={product} key={key} />
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
