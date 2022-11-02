import type { AppState } from "@app/store";
import { MedicalRecord } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MedicalRecordState {
  mode: "View" | "Edit" | "Add";
  medicalRecord?: MedicalRecord;
}

const initialState: MedicalRecordState = {
  mode: "View",
};

export const medicalRecordSlice = createSlice({
  name: "medicalRecord",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setMedicalRecordMode: (
      state,
      action: PayloadAction<MedicalRecordState>
    ) => {
      const { mode, medicalRecord } = action.payload;
      state.mode = mode;
      if (medicalRecord) {
        state.medicalRecord = medicalRecord;
      }
    },
  },
});

export const { setMedicalRecordMode } = medicalRecordSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const medicalRecordState = (state: AppState) => state.medicalRecord;

export default medicalRecordSlice.reducer;
