import DeviceHelper from "../../utils/DeviceHelper";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getRouterCapabilities } from "../../api/api";

const deviceHelper = new DeviceHelper();

const loadDevice = createAsyncThunk("device/loadDevice", async () => {
  const result = await getRouterCapabilities();
  const routerRtpCapabilities = result.data;
  return deviceHelper.loadDevice(routerRtpCapabilities);
});

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
    builder.addCase(loadDevice.fulfilled, (state) => {
      state.loaded = true;
    });
  },
});

export const { setDeviceLoaded } = deviceSlice.actions;

export default deviceSlice.reducer;
