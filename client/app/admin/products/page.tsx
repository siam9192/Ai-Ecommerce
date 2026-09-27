import Image from "next/image";
import Link from "next/link";
import { productService } from "@/api-services/products.api.services";
import AppStatePageTracker from "@/components/shared/app-state-page-tracker";
import {
  FiArrowLeft,
  FiEdit2,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";

export default async function AdminProductsPage() {
  const response = await productService.searchProducts();
const products = response.success ? response.data : [];

return (
  <main className="min-h-screen bg-slate-100 px-4 py-6 lg:px-6">
    <AppStatePageTracker
      page="products"
      ids={products.map((product) => product.id)}
    />

    <div className="mx-auto max-w-[1400px]">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-primary"
          >
            <FiArrowLeft size={16} />
            Back to dashboard
          </Link>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Products
          </h1>
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

      {/* Product Table */}
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="transition hover:bg-slate-50"
                >
                  {/* Product */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                        <Image
                          src={product.images?.[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div>
                        <h2 className="font-semibold text-slate-900">
                          {product.name}
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                          ID: {product.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">
                      {product.category ?? "Product"}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-900">
                      ${Number(product.main_price).toFixed(2)}
                    </span>
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        product.available_stock > 0
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.available_stock > 0
                        ? `${product.available_stock} in stock`
                        : "Out of stock"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-primary hover:text-primary"
                      >
                        <FiEdit2 size={15} />
                      </button>

                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 transition hover:bg-red-100"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-slate-500">
              No products found.
            </p>
          </div>
        )}
      </div>
    </div>
  </main>
);

  
}
