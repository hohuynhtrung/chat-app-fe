import { createAsyncThunk } from "@reduxjs/toolkit";
import http from "@/utils/http";

export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http("/auth/login", data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.message.data.message || "Đăng nhập thất bại",
      );
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post("/auth/register", data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Register failed",
      );
    }
  },
);
