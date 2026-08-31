import { configureStore } from "@reduxjs/toolkit";
import appStateReducer from "@/redux/features/appState-slice";
import cartReducer from "@/redux/features/cart-slice";

export const store = configureStore({
  reducer: {
    appState: appStateReducer,
    cart: cartReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
