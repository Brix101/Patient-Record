import type { AppState } from "@app/store";
import { Patient } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PatientsState {
  mode: "View" | "Edit" | "Add";
  patient?: Patient;
}

const initialState: PatientsState = {
  mode: "View",
};

export const patientsSlice = createSlice({
  name: "patients",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setPatientsMode: (state, action: PayloadAction<PatientsState>) => {
      const { mode, patient } = action.payload;
      state.mode = mode;
      if (patient) {
        state.patient = patient;
      }
    },
  },
});

export const { setPatientsMode } = patientsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const patientsState = (state: AppState) => state.patient;

export default patientsSlice.reducer;
