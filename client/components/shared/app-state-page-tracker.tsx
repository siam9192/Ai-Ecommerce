"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  clearAiSearchProductsIds,
  clearCartItemsIds,
  clearCustomerOrdersIds,
  clearCustomersIds,
  clearFeaturedProductsIds,
  clearOrdersIds,
  clearProductsIds,
  clearShopProductsIds,
  clearWishlistItemsIds,
  setAiSearchProductsIds,
  setCartItemsIds,
  setCustomerOrdersIds,
  setCustomersIds,
  setFeaturedProductsIds,
  setOrdersIds,
  setProductsIds,
  setShopProductsIds,
  setWishlistItemsIds,
} from "@/redux/features/appState-slice";

export type AppStatePage =
  | "featured"
  | "shop"
  | "ai-search"
  | "customer-orders"
  | "customers"
  | "orders"
  | "products"
  | "cart-items"
  | "wishlist-items";

interface AppStatePageTrackerProps {
  page: AppStatePage;
  ids: number[];
}

const pageActions = {
  featured: [setFeaturedProductsIds, clearFeaturedProductsIds],
  shop: [setShopProductsIds, clearShopProductsIds],
  "ai-search": [setAiSearchProductsIds, clearAiSearchProductsIds],
  "customer-orders": [setCustomerOrdersIds, clearCustomerOrdersIds],
  customers: [setCustomersIds, clearCustomersIds],
  orders: [setOrdersIds, clearOrdersIds],
  products: [setProductsIds, clearProductsIds],
  "cart-items": [setCartItemsIds, clearCartItemsIds],
  "wishlist-items": [setWishlistItemsIds, clearWishlistItemsIds],
} as const;

export default function AppStatePageTracker({
  page,
  ids,
}: AppStatePageTrackerProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(pageActions[page][0](ids));

    return () => {
      dispatch(pageActions[page][1]());
    };
  }, [dispatch, ids, page]);

  return null;
}
