import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";

export interface SwiftState {
  micStream: MediaStream | null;
  videoStream: MediaStream | null;
}

const initialState: SwiftState = {
  micStream: null,
  videoStream: null,
};

export const counterSlice = createSlice({
  name: "Swift",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setMicStream: (state, action: PayloadAction<MediaStream>) => {
      state.micStream = action.payload;
    },
    setVideoStream: (state, action: PayloadAction<MediaStream>) => {
      state.videoStream = action.payload;
    },
  },
});

export default counterSlice.reducer;
