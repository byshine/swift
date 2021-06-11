import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import swiftReducer from "../features/swift/swift";

export const store = configureStore({
  reducer: {
    swift: swiftReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
