import type { AppState } from "@app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  edit: boolean;
  id?: number;
}

const initialState: UserState = {
  edit: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setEditMode: (state, action: PayloadAction<UserState>) => {
      const { edit, id } = action.payload;
      state.edit = edit;
      if (id) {
        state.id = id;
      }
    },
  },
});

export const { setEditMode } = userSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const userState = (state: AppState) => state.user;

export default userSlice.reducer;
