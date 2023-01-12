import medicalRecordReducer from "@/features/medicalRecord/medicalRecordSlice";
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
      user: userReducer,
      patient: patientReducer,
      medicalRecord: medicalRecordReducer,
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
