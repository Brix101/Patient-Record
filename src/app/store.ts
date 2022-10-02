import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import sidebarReducer from "../features/sideBar/sidebarSlice";
import signinReducer from "../features/signin/signinSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      sidebar: sidebarReducer,
      signin: signinReducer,
    },
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;
