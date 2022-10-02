import { createSlice } from "@reduxjs/toolkit";
import type { AppState } from "../../app/store";

export interface SideBarState {
  open: boolean;
}

const initialState: SideBarState = {
  open: true,
};

export const sideBarSlice = createSlice({
  name: "sideBar",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    toggleSideBar: (state) => {
      state.open = !state.open;
    },
  },
});

export const { toggleSideBar } = sideBarSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const sideBarState = (state: AppState) => state.sideBar;

export default sideBarSlice.reducer;
