import { configureStore } from "@reduxjs/toolkit";
import deviceReducer from "./slices/deviceSlice";
import authReducer from "./slices/authSlice";
import connectionReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    device: deviceReducer,
    auth: authReducer,
    connection: connectionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
