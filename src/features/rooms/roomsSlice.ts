import type { AppState } from "@app/store";
import { Room } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RoomsState {
  mode: "View" | "Edit" | "Add";
  room?: Room;
}

const initialState: RoomsState = {
  mode: "View",
};

export const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setRoomsMode: (state, action: PayloadAction<RoomsState>) => {
      const { mode, room } = action.payload;
      state.mode = mode;
      if (room) {
        state.room = room;
      }
    },
  },
});

export const { setRoomsMode } = roomsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const roomsState = (state: AppState) => state.rooms;

export default roomsSlice.reducer;
