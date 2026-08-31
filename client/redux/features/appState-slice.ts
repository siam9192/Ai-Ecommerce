import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AppStateSlice {
  isAiOpen: boolean;
}

const initialState: AppStateSlice = {
  isAiOpen: false,
};

export const appStateSlice = createSlice({
  name: "appState",
  initialState,
  reducers: {
    setAiOpen: (state, action: PayloadAction<boolean>) => {
      state.isAiOpen = action.payload;
    },
  },
});

export const { setAiOpen } = appStateSlice.actions;

export default appStateSlice.reducer;
