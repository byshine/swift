import DeviceHelper from "../../utils/DeviceHelper";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getRouterCapabilities } from "../../api/api";

export const deviceHelper = new DeviceHelper();

export const loadDevice = createAsyncThunk("device/loadDevice", async () => {
  const result = await getRouterCapabilities();
  const routerRtpCapabilities = result.data;
  /*
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 5000);
  });
  */
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
