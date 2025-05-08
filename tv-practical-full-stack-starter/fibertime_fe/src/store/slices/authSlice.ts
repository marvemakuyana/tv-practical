import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios";
import { User } from "../../types/user";

interface AuthState {
  user: User | null;
  phoneNumber: string;
  otp: string;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  phoneNumber: "",
  otp: "",
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const requestOtp = createAsyncThunk(
  "auth/requestOtp",
  async (phone: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/auth/request-otp", {
        phone,
      });

      return response.data.otp;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Request failed");
    }
  }
);

export const login = createAsyncThunk(
  "/api/auth/login",
  async (
    { phone, otp }: { phone: string; otp: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/api/auth/login", {
        phone,
        otp,
      });
      return response.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    setOtp: (state, action) => {
      state.otp = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.phoneNumber = action.payload;
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPhoneNumber, setOtp } = authSlice.actions;
export default authSlice.reducer;
