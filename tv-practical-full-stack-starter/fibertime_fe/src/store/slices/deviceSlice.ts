import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios";
import { Device } from "../../types/device";

interface DeviceState {
  device: Device | null;
  code: string;
  isConnected: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: DeviceState = {
  device: null,
  code: "",
  isConnected: false,
  loading: false,
  error: null,
};

export const fetchDevice = createAsyncThunk(
  "device/fetchDevice",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/device/generate-tv-code");
      return response.data as Device;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch device"
      );
    }
  }
);
export const connectDevice = createAsyncThunk(
  "device/connectDevice",
  async (payload: { code: string; phone: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/device/connect-device", {
        code: payload.code,
        phone: payload.phone,
      });
      console.log("Response from connect-device:", response);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Connection failed"
      );
    }
  }
);

export const checkConnectionStatus = createAsyncThunk(
  "device/checkConnectionStatus",
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/device/connection-status/${code}`
      );
      console.log("Connection status:", response.data);
      return response.data.isConnected as boolean;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to check connection status"
      );
    }
  }
);
export const fetchUserBundle = createAsyncThunk(
  "device/fetchUserBundle",
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/device/user-bundle/${code}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch bundle info"
      );
    }
  }
);

const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    setCode: (state, action) => {
      state.code = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevice.fulfilled, (state, action) => {
        state.loading = false;
        state.device = action.payload;
      })
      .addCase(fetchDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(connectDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(connectDevice.fulfilled, (state, action) => {
        state.loading = false;
        state.isConnected = true;
        state.device = action.payload;
      })

      .addCase(connectDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to connect device.";
      })
      .addCase(checkConnectionStatus.fulfilled, (state, action) => {
        state.isConnected = action.payload;
      })
      .addCase(checkConnectionStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchUserBundle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBundle.fulfilled, (state, action) => {
        state.loading = false;
        if (state.device) {
          state.device.bundleInfo = action.payload;
        }
      })
      .addCase(fetchUserBundle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCode } = deviceSlice.actions;
export default deviceSlice.reducer;
