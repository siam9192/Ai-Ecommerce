import Link from "next/link";
import ProductCard from "@/components/ui/product-card";
import { products } from "@/data/products";

export default function ProductsPage() {
  return (
    <main className="container mx-auto min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Browse collection
          </p>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Shop all products
          </h1>
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="rounded-full bg-muted px-3 py-1.5 font-medium text-foreground">
            {products.length} items
          </span>
          <Link
            href="/shop"
            className="text-primary transition hover:text-primary/80"
          >
            Visit the shop page
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
