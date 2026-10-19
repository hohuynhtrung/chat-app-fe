import http from "@/utils/http";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Đăng ký
export const register = createAsyncThunk(
  "auth/register",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await http.post("/auth/register", credentials);
      const { accessToken, user } = response.data || response;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
      }

      return { accessToken, user };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Đăng ký thất bại";
      return rejectWithValue(message);
    }
  },
);

// Đăng nhập
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await http.post("/auth/login", credentials);
      const { accessToken, user } = response.data || response;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
      }

      return { accessToken, user };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Đăng nhập thất bại";
      return rejectWithValue(message);
    }
  },
);
