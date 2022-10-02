import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import sideBarReducer from "../features/sideBar/sideBarSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      sideBar: sideBarReducer,
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
