import type { AppState } from "@app/store";
import { Medicine } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MedicinesState {
  mode: "View" | "Edit" | "Add";
  medicine?: Medicine;
}

const initialState: MedicinesState = {
  mode: "View",
};

export const medicinesSlice = createSlice({
  name: "medicines",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setMedicinesMode: (state, action: PayloadAction<MedicinesState>) => {
      const { mode, medicine } = action.payload;
      state.mode = mode;
      if (medicine) {
        state.medicine = medicine;
      }
    },
  },
});

export const { setMedicinesMode } = medicinesSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const medicinesState = (state: AppState) => state.medicines;

export default medicinesSlice.reducer;
