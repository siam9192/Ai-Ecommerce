import Link from "next/link";
import ProductCard from "@/components/ui/product-card";
import { products } from "@/data/products";

export default function ShopPage() {
  return (
    <main className="container mx-auto min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <section className="mb-12 overflow-hidden rounded-[28px] bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 px-6 py-10 text-white shadow-xl sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
              AI-powered shopping
            </p>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Smart essentials for everyday life
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
            Featured picks
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            Curated for modern living
          </h2>
        </div>
        <span className="text-sm text-muted-foreground">
          {products.length} products available
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
