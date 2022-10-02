import type { AppState } from "@app/store";
import { Physician, User } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";

export interface UsersState {
  mode: "View" | "Edit" | "Add";
  user?: User & { Physician: Physician[] };
}

const initialState: UsersState = {
  mode: "View",
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    toggleSideBar: (state) => {
      // state.open = !state.open;
    },
  },
});

export const { toggleSideBar } = usersSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const usersState = (state: AppState) => state.users;

export default usersSlice.reducer;