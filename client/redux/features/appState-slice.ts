import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AppStateSlice {
  isAiOpen: boolean;
  featured_products_id: number[];
  shop_products_id: number[];
  ai_search_products_id: number[];
  customer_orders_id: number[];
  customers_id: number[];
  orders_id: number[];
  products_id: number[];
  cart_items_id: number[];
  wishlist_items_id: number[];
  
}

const initialState: AppStateSlice = {
  isAiOpen: false,
  featured_products_id: [],
  shop_products_id: [],
  ai_search_products_id: [],
  customer_orders_id: [],
  customers_id: [],
  orders_id: [],
  products_id: [],
  cart_items_id: [],
  wishlist_items_id: [],
};

export const appStateSlice = createSlice({
  name: "appState",
  initialState,
  reducers: {
    setAiOpen: (state, action: PayloadAction<boolean>) => {
      state.isAiOpen = action.payload;
    },
    setFeaturedProductsIds: (state, action: PayloadAction<number[]>) => {
      state.featured_products_id = action.payload;
    },
    clearFeaturedProductsIds: (state) => {
      state.featured_products_id = [];
    },
    setShopProductsIds: (state, action: PayloadAction<number[]>) => {
      state.shop_products_id = action.payload;
    },
    clearShopProductsIds: (state) => {
      state.shop_products_id = [];
    },
    setAiSearchProductsIds: (state, action: PayloadAction<number[]>) => {
      state.ai_search_products_id = action.payload;
    },
    clearAiSearchProductsIds: (state) => {
      state.ai_search_products_id = [];
    },
    setCustomerOrdersIds: (state, action: PayloadAction<number[]>) => {
      state.customer_orders_id = action.payload;
    },
    clearCustomerOrdersIds: (state) => {
      state.customer_orders_id = [];
    },
    setCustomersIds: (state, action: PayloadAction<number[]>) => {
      state.customers_id = action.payload;
    },
    clearCustomersIds: (state) => {
      state.customers_id = [];
    },
    setOrdersIds: (state, action: PayloadAction<number[]>) => {
      state.orders_id = action.payload;
    },
    clearOrdersIds: (state) => {
      state.orders_id = [];
    },
    setProductsIds: (state, action: PayloadAction<number[]>) => {
      state.products_id = action.payload;
    },
    clearProductsIds: (state) => {
      state.products_id = [];
    },
    setCartItemsIds: (state, action: PayloadAction<number[]>) => {
      state.cart_items_id = action.payload;
    },
    clearCartItemsIds: (state) => {
      state.cart_items_id = [];
    },
    setWishlistItemsIds: (state, action: PayloadAction<number[]>) => {
      state.wishlist_items_id = action.payload;
    },
    clearWishlistItemsIds: (state) => {
      state.wishlist_items_id = [];
    },
  },
});

export const {
  setAiOpen,
  setFeaturedProductsIds,
  clearFeaturedProductsIds,
  setShopProductsIds,
  clearShopProductsIds,
  setAiSearchProductsIds,
  clearAiSearchProductsIds,
  setCustomerOrdersIds,
  clearCustomerOrdersIds,
  setCustomersIds,
  clearCustomersIds,
  setOrdersIds,
  clearOrdersIds,
  setProductsIds,
  clearProductsIds,
  setCartItemsIds,
  clearCartItemsIds,
  setWishlistItemsIds,
  clearWishlistItemsIds,
} = appStateSlice.actions;

export default appStateSlice.reducer;
