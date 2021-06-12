import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DeviceState {
  loaded: Boolean;
}

const initialState: DeviceState = {
  loaded: false,
};

export const deviceSlice = createSlice({
  name: "Device",
  initialState,
  reducers: {
    setDeviceLoaded: (state, action: PayloadAction<Boolean>) => {
      state.loaded = action.payload;
    },
  },
});

export const { setDeviceLoaded } = deviceSlice.actions;
