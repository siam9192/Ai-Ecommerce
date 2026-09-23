import Link from "next/link";
import { productService } from "@/api-services/products.api.services";
import ProductCard from "@/components/ui/product-card";
import type { Product } from "@/types/product.type";
import AppStatePageTracker from "@/components/shared/app-state-page-tracker";

interface ShopPageProps {
  searchParams: Promise<{ search?: string | string[] }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const search = Array.isArray(params.search)
    ? params.search[0]
    : params.search;
  const trimmedSearch = search?.trim() ?? "";

  let products: Product[] = [];
  let hasError = false;

  try {
    const response = await productService.searchProducts(trimmedSearch);
    console.log(response);
    products = response.success ? response.data : [];
    hasError = !response.success;
  } catch (e) {
    hasError = true;
  }

  return (
    <main className="container mx-auto min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <AppStatePageTracker
        page="shop"
        ids={products.map((product) => product.id)}
      />
      <section className="mb-12 overflow-hidden rounded-[28px] bg-linear-to-r from-slate-950 via-indigo-950 to-slate-900 px-6 py-10 text-white shadow-xl sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
              AI-powered shopping
            </p>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              {trimmedSearch
                ? `Search results for "${trimmedSearch}"`
                : "Smart essentials for everyday life"}
            </h1>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Explore all products
          </Link>
        </div>
      </section>

      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            {trimmedSearch ? "Search results" : "Featured picks"}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {trimmedSearch
              ? "Products matching your search"
              : "Curated for modern living"}
          </h2>
        </div>
        <span className="text-sm text-muted-foreground">
          {products.length} {products.length === 1 ? "product" : "products"}{" "}
          available
        </span>
      </div>

      {hasError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
          <h2 className="text-xl font-semibold text-red-900">
            Products are unavailable right now
          </h2>
          <p className="mt-2 text-sm text-red-700">
            Please try again in a moment.
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-border bg-muted p-10 text-center">
          <h2 className="text-xl font-semibold text-foreground">
            No products found
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different search term or browse the full collection.
          </p>
          {trimmedSearch && (
            <Link
              href="/shop"
              className="mt-5 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              View all products
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
