import {
  configureStore,
  ThunkAction,
  Action,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import swiftReducer from "../features/swift/swift";
import deviceReducer from "../features/device/device";
import peersReducer from "../features/peers/peers";
import { logger } from "../features/middlewares/middlewares";

export const store = configureStore({
  reducer: {
    swift: swiftReducer,
    device: deviceReducer,
    peers: peersReducer,
  },
  middleware: [...getDefaultMiddleware(), logger],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
