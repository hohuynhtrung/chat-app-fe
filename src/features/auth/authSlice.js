import { createSlice } from "@reduxjs/toolkit";
import {
  getCurrentUser,
  login,
  register,
  logout,
} from "@/service/auth/authService";

const savedAccessToken = localStorage.getItem("accessToken") || null;
const savedUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  currentUser: savedUser,
  accessToken: savedAccessToken,
  isAuthenticated: !!savedAccessToken,
  loading: false,
  fetching: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.fetching = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.fetching = false;
        const userData = action.payload.data || action.payload;
        state.currentUser = userData;
        state.isAuthenticated = true;
        if (userData) {
          localStorage.setItem("user", JSON.stringify(userData));
        }
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.fetching = false;
        state.currentUser = null;
        state.isAuthenticated = false;
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;

        const payloadData = action.payload.data || action.payload;

        state.accessToken = payloadData.accessToken;
        state.currentUser = payloadData.user; // 👈 Gán user cho cả register

        if (payloadData.user) {
          localStorage.setItem("user", JSON.stringify(payloadData.user));
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;

        // Dựa vào cấu trúc JSON của bạn: action.payload.data chứa accessToken và user
        const payloadData = action.payload.data || action.payload;

        state.accessToken = payloadData.accessToken;
        state.currentUser = payloadData.user;

        // Lưu thêm vào localStorage nếu cần giữ trạng thái user
        if (payloadData.user) {
          localStorage.setItem("user", JSON.stringify(payloadData.user));
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.fetching = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.currentUser = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.currentUser = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
