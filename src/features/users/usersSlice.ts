import type { AppState } from "@app/store";
import { Physician, User } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UsersState {
  mode?: "View" | "Edit" | "Add";
  account?: boolean;
  user?: User & {
    Physician: Physician | null;
  };
}

const initialState: UsersState = {
  mode: "View",
  account: false,
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setUsersMode: (state, action: PayloadAction<UsersState>) => {
      const { mode, user } = action.payload;
      state.mode = mode;
      if (user) {
        state.user = user;
      }
    },
    setAccountMode: (state, action: PayloadAction<UsersState>) => {
      const { account, user } = action.payload;
      state.account = account;
      if (user) {
        state.user = user;
      }
    },
  },
});

export const { setUsersMode, setAccountMode } = usersSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const usersState = (state: AppState) => state.users;

export default usersSlice.reducer;
