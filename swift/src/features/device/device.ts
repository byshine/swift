import DeviceHelper from "./DeviceHelper";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getRouterCapabilities } from "../../api/api";

export const deviceHelper = new DeviceHelper();

export const loadDevice = createAsyncThunk("device/loadDevice", async () => {
  const result = await getRouterCapabilities();
  const routerRtpCapabilities = result.data;
  const device = await deviceHelper.loadDevice(routerRtpCapabilities);
  return device.loaded;
});

export interface DeviceState {
  loaded: Boolean;
  queryAudio: Boolean | null;
  queryVideo: Boolean | null;
}

const initialState: DeviceState = {
  loaded: false,
  queryAudio: null,
  queryVideo: null,
};

export const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    loaded: (state, action: PayloadAction<Boolean>) => {
      state.loaded = action.payload;
    },
    queryAudio: (state, action: PayloadAction<Boolean>) => {
      state.queryAudio = action.payload;
    },
    queryVideo: (state, action: PayloadAction<Boolean>) => {
      state.queryVideo = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(loadDevice.fulfilled, (state, action) => {
      state.loaded = action.payload;
    });
  },
});

export const { loaded, queryAudio, queryVideo } = deviceSlice.actions;

export default deviceSlice.reducer;
