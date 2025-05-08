import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios";

interface ConnectionState {
  status: "idle" | "connecting" | "connected";
  bundle: string;
  error: string | null;
}

const initialState: ConnectionState = {
  status: "idle",
  bundle: "",
  error: null,
};

export const checkConnectionStatus = createAsyncThunk(
  "connection/status",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/connection-status");
      return res.data.status;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Polling failed");
    }
  }
);

export const getUserBundle = createAsyncThunk(
  "connection/bundle",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/user-bundle");
      return res.data.bundle;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch bundle"
      );
    }
  }
);

const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkConnectionStatus.fulfilled, (state, action) => {
        if (action.payload === "connected") {
          state.status = "connected";
        } else {
          state.status = "connecting";
        }
      })
      .addCase(getUserBundle.fulfilled, (state, action) => {
        state.bundle = action.payload;
      });
  },
});

export default connectionSlice.reducer;
