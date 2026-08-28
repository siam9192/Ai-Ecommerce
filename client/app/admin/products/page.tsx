import Link from "next/link";
import Image from "next/image";
import {
  FiArrowLeft,
  FiEdit2,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";

const products = [
  {
    id: 1,
    name: "Sony WH-1000XM5",
    category: "Audio",
    price: 399.99,
    stock: 45,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Apple Watch Series 9",
    category: "Wearables",
    price: 399,
    stock: 30,
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Keychron K2",
    category: "Accessories",
    price: 84.99,
    stock: 60,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Canon EOS R6 Mark II",
    category: "Cameras",
    price: 2499,
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
  },
];

export default function AdminProductsPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-primary"
            >
              <FiArrowLeft size={16} />
              Back to dashboard
            </Link>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">Products</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-500 shadow-sm">
              <FiSearch size={16} />
              <input
                type="text"
                placeholder="Search products"
                className="w-40 border-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover"
            >
              <FiPlus size={16} />
              Add product
            </button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative h-48 w-full bg-slate-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {product.category}
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-slate-900">
                      {product.name}
                    </h2>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                    {product.stock} in stock
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-slate-900">
                    ${product.price.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-primary hover:text-primary"
                    >
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 transition hover:bg-red-100"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
