import type { AppState } from "@app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SignInState {
  confirm: boolean;
  email?: string;
  hash?: string;
}

const initialState: SignInState = {
  confirm: false,
};

export const signinSlice = createSlice({
  name: "signin",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    confirmMode: (state, action: PayloadAction<SignInState>) => {
      state.confirm = action.payload.confirm;
      state.email = action.payload.email;
      state.hash = action.payload.hash;
    },
    signinMode: () => initialState,
  },
});

export const { confirmMode, signinMode } = signinSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const signinState = (state: AppState) => state.signin;

export default signinSlice.reducer;
