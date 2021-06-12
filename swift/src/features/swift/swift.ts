import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SwiftState {
  micStream: Boolean | null;
  videoStream: Boolean | null;
  joined: Boolean;
}

const initialState: SwiftState = {
  micStream: null,
  videoStream: null,
  joined: false,
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
    setJoined: (state, action: PayloadAction<Boolean>) => {
      state.joined = action.payload;
    },
  },
});

export const { setMicStream, setVideoStream, setJoined } = swiftSlice.actions;

export default swiftSlice.reducer;
