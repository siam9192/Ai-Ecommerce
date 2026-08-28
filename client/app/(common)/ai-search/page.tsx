"use client";

import ProductCard from "@/components/ui/product-card";
import Pagination from "@/components/ui/pagination";
import { products } from "@/data/products";
import { useMemo, useState } from "react";

const ITEMS_PER_PAGE = 8;

function AiSearchPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const visibleProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return products.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage]);

  return (
    <div className="container mx-auto min-h-screen py-10">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <p className="text-xl font-medium text-slate-800">
          AI search results · found {products.length} items
        </p>
        <p className="text-sm text-slate-500">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visibleProducts.map((product, key) => (
          <ProductCard product={product} key={`${product.name}-${key}`} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) =>
          setCurrentPage(Math.min(Math.max(page, 1), totalPages))
        }
      />
    </div>
  );
}

export default AiSearchPage;
