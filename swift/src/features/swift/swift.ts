import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SwiftState {
  joined: Boolean;
  connected: Boolean;
}

const initialState: SwiftState = {
  joined: false,
  connected: false,
};

export const swiftSlice = createSlice({
  name: "Swift",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setJoined: (state, action: PayloadAction<Boolean>) => {
      state.joined = action.payload;
    },
    connected: (state, action: PayloadAction<Boolean>) => {
      state.joined = action.payload;
    },
  },
});

export const { setJoined } = swiftSlice.actions;

export default swiftSlice.reducer;
