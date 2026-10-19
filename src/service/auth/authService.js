import http from "@/utils/http";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await http.get("auth/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Thông tin người dùng không tồn tại",
      );
    }
  },
);

// Đăng ký
export const register = createAsyncThunk(
  "auth/register",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await http.post("/auth/register", credentials);
      const accessToken = response.data?.accessToken || response.accessToken;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Đăng ký thất bại");
    }
  },
);

// Đăng nhập
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await http.post("/auth/login", credentials);
      const accessToken = response.data?.accessToken || response.accessToken;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Đăng nhập thất bại");
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await http.post("/auth/logout");

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      return null;
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      return rejectWithValue(error.message || "Đăng xuất thất bại");
    }
  },
);
