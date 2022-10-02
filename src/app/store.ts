import sidebarReducer from "@features/sideBar/sidebarSlice";
import signinReducer from "@features/signin/signinSlice";
import usersReducer from "@features/users/usersSlice";
import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";

export function makeStore() {
  return configureStore({
    reducer: {
      sidebar: sidebarReducer,
      signin: signinReducer,
      users: usersReducer,
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
