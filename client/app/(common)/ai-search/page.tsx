"use client";

import ProductCard from "@/components/ui/product-card";
import Pagination from "@/components/ui/pagination";
import { useEffect, useMemo, useRef, useState } from "react";
import AppStatePageTracker from "@/components/shared/app-state-page-tracker";
import {
  setAiOpen,
  setAiSearchResults,
} from "@/redux/features/appState-slice";
import { getProductBySlug } from "@/api-services/products.api.services";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { ProductResponse } from "@/types/ai.type";
import { ProductStatus } from "@/types/product.type";

const ITEMS_PER_PAGE = 8;
const AI_SEARCH_STORAGE_KEY = "ai_search_results";

function isProductResponse(value: unknown): value is ProductResponse {
  if (typeof value !== "object" || value === null) return false;
  const product = value as Record<string, unknown>;

  return (
    typeof product.id === "number" &&
    typeof product.name === "string" &&
    typeof product.slug === "string" &&
    (typeof product.description === "string" ||
      product.description === null ||
      product.description === undefined) &&
    (typeof product.category === "string" ||
      product.category === null ||
      product.category === undefined) &&
    typeof product.regular_price === "number" &&
    typeof product.main_price === "number" &&
    Array.isArray(product.images) &&
    product.images.every((image) => typeof image === "string") &&
    typeof product.available_stock === "number" &&
    (product.status === "active" || product.status === "inactive") &&
    typeof product.created_at === "string" &&
    typeof product.updated_at === "string" &&
    (typeof product.wish_listed === "boolean" ||
      product.wish_listed === null ||
      product.wish_listed === undefined) &&
    (typeof product.cart_item_listed === "boolean" ||
      product.cart_item_listed === null ||
      product.cart_item_listed === undefined)
  );
}

function AiSearchPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [hasRestoredResults, setHasRestoredResults] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [refreshError, setRefreshError] = useState("");
  const hasAttemptedRestore = useRef(false);
  const dispatch = useAppDispatch();
  const refreshToggle = useAppSelector(
    (state) => state.appState.state_update_toggle,
  );
  const previousRefreshToggle = useRef(refreshToggle);
  const products = useAppSelector(
    (state) => state.appState.ai_search_results,
  );

  useEffect(() => {
    if (hasAttemptedRestore.current) return;
    hasAttemptedRestore.current = true;

    if (products.length > 0) {
      setHasRestoredResults(true);
      return;
    }

    try {
      const savedResults = sessionStorage.getItem(AI_SEARCH_STORAGE_KEY);
      if (savedResults) {
        const parsedResults: unknown = JSON.parse(savedResults);
        if (
          Array.isArray(parsedResults) &&
          parsedResults.every(isProductResponse)
        ) {
          if (parsedResults.length > 0) {
            dispatch(setAiSearchResults(parsedResults));
          }
        } else {
          sessionStorage.removeItem(AI_SEARCH_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error("Failed to restore AI search results:", error);
      setStorageError("Saved AI search results could not be restored.");
    } finally {
      setHasRestoredResults(true);
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    if (!hasRestoredResults) return;

    try {
      sessionStorage.setItem(
        AI_SEARCH_STORAGE_KEY,
        JSON.stringify(products),
      );
      setStorageError("");
    } catch (error) {
      console.error("Failed to save AI search results:", error);
      setStorageError("AI search results could not be saved for this session.");
    }
  }, [hasRestoredResults, products]);

  useEffect(() => {
    if (previousRefreshToggle.current === refreshToggle) return;
    previousRefreshToggle.current = refreshToggle;
    if (!hasRestoredResults || products.length === 0) return;

    let isCurrent = true;
    const refreshSearchResults = async () => {
      try {
        const refreshedProducts = await Promise.all(
          products.map(async (product) => {
            const response = await getProductBySlug(product.slug);
            if (!response.success) {
              throw new Error(`Product ${product.id} could not be refreshed.`);
            }
            const status =
              response.data.status === ProductStatus.ACTIVE ||
              response.data.status === ProductStatus.INACTIVE
                ? response.data.status
                : product.status;

            return {
              ...product,
              ...response.data,
              status,
            };
          }),
        );

        if (!isCurrent) return;
        dispatch(setAiSearchResults(refreshedProducts));
        setRefreshError("");
      } catch (error) {
        console.error("Failed to refresh AI search results:", error);
        if (isCurrent) {
          setRefreshError(
            "Some AI search products could not be refreshed. Please try again.",
          );
        }
      }
    };

    void refreshSearchResults();
    return () => {
      isCurrent = false;
    };
  }, [dispatch, hasRestoredResults, products, refreshToggle]);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const activePage = Math.min(currentPage, Math.max(totalPages, 1));

  const visibleProducts = useMemo(() => {
    const start = (activePage - 1) * ITEMS_PER_PAGE;
    return products.slice(start, start + ITEMS_PER_PAGE);
  }, [activePage, products]);
  const visibleProductIds = useMemo(
    () => visibleProducts.map((product) => product.id),
    [visibleProducts],
  );
  const firstVisibleProduct = (activePage - 1) * ITEMS_PER_PAGE + 1;
  const lastVisibleProduct = Math.min(
    activePage * ITEMS_PER_PAGE,
    products.length,
  );

  return (
    <div className="container mx-auto min-h-screen py-10">
      {storageError && (
        <p
          className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800"
          role="alert"
        >
          {storageError}
        </p>
      )}
      {refreshError && (
        <p
          className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800"
          role="alert"
        >
          {refreshError}
        </p>
      )}
      <AppStatePageTracker
        page="ai-search"
        ids={visibleProductIds}
      />
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            AI search results
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {products.length === 1
              ? "1 product found"
              : `${products.length} products found`}
          </p>
        </div>
        {totalPages > 1 && (
          <p className="text-sm text-slate-500">
            Showing {firstVisibleProduct}–{lastVisibleProduct} of{" "}
            {products.length}
          </p>
        )}
      </div>

      {!hasRestoredResults ? (
        <p className="py-16 text-center text-sm text-slate-500">
          Restoring your AI search results...
        </p>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>

          <Pagination
            currentPage={activePage}
            totalPages={totalPages}
            onPageChange={(page) =>
              setCurrentPage(Math.min(Math.max(page, 1), totalPages))
            }
          />
        </>
      ) : (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 px-6 text-center">
          <h2 className="text-lg font-semibold text-slate-800">
            No AI search results yet
          </h2>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            Ask the AI assistant to find products, and your matching items will
            appear here.
          </p>
          <button
            type="button"
            onClick={() => dispatch(setAiOpen(true))}
            className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            Ask AI to find products
          </button>
        </div>
      )}
    </div>
  );
}

export default AiSearchPage;
