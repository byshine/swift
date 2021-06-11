import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SwiftState {
  micStream: Boolean | null;
  videoStream: Boolean | null;
}

const initialState: SwiftState = {
  micStream: null,
  videoStream: null,
};

export const swiftSlice = createSlice({
  name: "Swift",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setMicStream: (state, action: PayloadAction<Boolean>) => {
      state.micStream = action.payload;
    },
    setVideoStream: (state, action: PayloadAction<Boolean>) => {
      state.videoStream = action.payload;
    },
  },
});

export const { setMicStream, setVideoStream } = swiftSlice.actions;

export default swiftSlice.reducer;
