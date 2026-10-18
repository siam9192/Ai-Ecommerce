import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ProductResponse } from "@/types/ai.type";

export interface AppStateSlice {
  isAiOpen: boolean;
  state_update_toggle: boolean;
  ai_search_results: ProductResponse[];
  featured_product_ids: number[];
  shop_product_ids: number[];
  ai_search_product_ids: number[];
  customer_order_ids: number[];
  customer_ids: number[];
  order_ids: number[];
  product_ids: number[];
  cart_item_ids: number[];
  cart_item_count: number;
  wishlist_item_ids: number[];
}

export type AppStateIdCollection =
  | "featured_product_ids"
  | "shop_product_ids"
  | "ai_search_product_ids"
  | "customer_order_ids"
  | "customer_ids"
  | "order_ids"
  | "product_ids"
  | "cart_item_ids"
  | "wishlist_item_ids";

const initialState: AppStateSlice = {
  isAiOpen: false,
  state_update_toggle: false,
  ai_search_results: [],
  featured_product_ids: [],
  shop_product_ids: [],
  ai_search_product_ids: [],
  customer_order_ids: [],
  customer_ids: [],
  order_ids: [],
  product_ids: [],
  cart_item_ids: [],
  cart_item_count: 0,
  wishlist_item_ids: [],
};

export const appStateSlice = createSlice({
  name: "appState",
  initialState,
  reducers: {
    setAiOpen: (state, action: PayloadAction<boolean>) => {
      state.isAiOpen = action.payload;
    },
    toggleStateUpdate: (state) => {
      state.state_update_toggle = !state.state_update_toggle;
    },
    setAiSearchResults: (state, action: PayloadAction<ProductResponse[]>) => {
      state.ai_search_results = action.payload;
      state.ai_search_product_ids = action.payload.map((product) => product.id);
    },
    addAppStateId: (
      state,
      action: PayloadAction<{ collection: AppStateIdCollection; id: number }>,
    ) => {
      const ids = state[action.payload.collection];
      if (!ids.includes(action.payload.id)) {
        ids.push(action.payload.id);
      }
    },
    removeAppStateId: (
      state,
      action: PayloadAction<{ collection: AppStateIdCollection; id: number }>,
    ) => {
      state[action.payload.collection] = state[
        action.payload.collection
      ].filter((id) => id !== action.payload.id);
    },
    clearAppStateCollection: (
      state,
      action: PayloadAction<AppStateIdCollection>,
    ) => {
      state[action.payload] = [];
      if (action.payload === "cart_item_ids") {
        state.cart_item_count = 0;
      }
    },
    setCartItemCount: (state, action: PayloadAction<number>) => {
      state.cart_item_count = Math.max(0, action.payload);
    },
    incrementCartItemCount: (state, action: PayloadAction<number>) => {
      state.cart_item_count = Math.max(
        0,
        state.cart_item_count + action.payload,
      );
    },
    setFeaturedProductsIds: (state, action: PayloadAction<number[]>) => {
      state.featured_product_ids = action.payload;
    },
    clearFeaturedProductsIds: (state) => {
      state.featured_product_ids = [];
    },
    setShopProductsIds: (state, action: PayloadAction<number[]>) => {
      state.shop_product_ids = action.payload;
    },
    clearShopProductsIds: (state) => {
      state.shop_product_ids = [];
    },
    setAiSearchProductsIds: (state, action: PayloadAction<number[]>) => {
      state.ai_search_product_ids = action.payload;
    },
    clearAiSearchProductsIds: (state) => {
      state.ai_search_product_ids = [];
    },
    setCustomerOrdersIds: (state, action: PayloadAction<number[]>) => {
      state.customer_order_ids = action.payload;
    },
    clearCustomerOrdersIds: (state) => {
      state.customer_order_ids = [];
    },
    setCustomersIds: (state, action: PayloadAction<number[]>) => {
      state.customer_ids = action.payload;
    },
    clearCustomersIds: (state) => {
      state.customer_ids = [];
    },
    setOrdersIds: (state, action: PayloadAction<number[]>) => {
      state.order_ids = action.payload;
    },
    clearOrdersIds: (state) => {
      state.order_ids = [];
    },
    setProductsIds: (state, action: PayloadAction<number[]>) => {
      state.product_ids = action.payload;
    },
    clearProductsIds: (state) => {
      state.product_ids = [];
    },
    setCartItemsIds: (state, action: PayloadAction<number[]>) => {
      state.cart_item_ids = action.payload;
    },
    clearCartItemsIds: (state) => {
      state.cart_item_ids = [];
    },
    setWishlistItemsIds: (state, action: PayloadAction<number[]>) => {
      state.wishlist_item_ids = action.payload;
    },
    clearWishlistItemsIds: (state) => {
      state.wishlist_item_ids = [];
    },
  },
});

export const {
  setAiOpen,
  toggleStateUpdate,
  setAiSearchResults,
  addAppStateId,
  removeAppStateId,
  clearAppStateCollection,
  setCartItemCount,
  incrementCartItemCount,
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
