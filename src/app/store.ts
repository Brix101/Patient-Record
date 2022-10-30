import medicinesReducer from "@/features/medicines/medicinesSlice";
import patientReducer from "@features/patients/patientsSlice";
import roomsReducer from "@features/rooms/roomsSlice";
import sidebarReducer from "@features/sideBar/sidebarSlice";
import userReducer from "@features/user/userSlice";
import usersReducer from "@features/users/usersSlice";
import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";

export function makeStore() {
  return configureStore({
    reducer: {
      sidebar: sidebarReducer,
      users: usersReducer,
      rooms: roomsReducer,
      medicines: medicinesReducer,
      user: userReducer,
      patient: patientReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
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
