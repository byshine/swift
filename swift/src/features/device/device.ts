import DeviceHelper from "../../utils/DeviceHelper";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getRouterCapabilities } from "../../api/api";
import { RtpCapabilities } from "mediasoup-client/lib/types";

export const deviceHelper = new DeviceHelper();

export const loadDevice = createAsyncThunk(
  "device/loadDevice",
  async (test) => {
    const result = await getRouterCapabilities();
    const routerRtpCapabilities = result.data;
    const device = await deviceHelper.loadDevice(routerRtpCapabilities);
    return device.loaded;
  }
);

export interface DeviceState {
  loaded: Boolean;
}

const initialState: DeviceState = {
  loaded: false,
};

export const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    setDeviceLoaded: (state, action: PayloadAction<Boolean>) => {
      state.loaded = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(loadDevice.fulfilled, (state, action) => {
      state.loaded = action.payload;
    });
  },
});

export const { setDeviceLoaded } = deviceSlice.actions;

export default deviceSlice.reducer;
