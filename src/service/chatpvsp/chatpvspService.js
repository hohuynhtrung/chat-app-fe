import http from "@/utils/http";
import { createAsyncThunk } from "@reduxjs/toolkit";

const unwrapResponse = (response) => {
  if (response?.success !== true) {
    throw new Error(response?.message || "Phản hồi API không hợp lệ");
  }

  return response.data;
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

export const getConversations = createAsyncThunk(
  "chat/getConversations",
  async (_, { rejectWithValue }) => {
    try {
      const conversations = unwrapResponse(await http.get("/conversations"));
      if (!Array.isArray(conversations)) {
        throw new Error("Danh sách hội thoại không hợp lệ");
      }
      return conversations;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Không thể tải danh sách hội thoại"),
      );
    }
  },
);

export const createDmConversation = createAsyncThunk(
  "chat/createDmConversation",
  async (userId, { rejectWithValue }) => {
    try {
      const conversation = unwrapResponse(
        await http.post("/conversations", {
          type: "dm",
          userId,
        }),
      );
      if (!conversation?.id) {
        throw new Error("Dữ liệu hội thoại không hợp lệ");
      }
      return conversation;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Không thể tạo đoạn chat"));
    }
  },
);

export const getMessages = createAsyncThunk(
  "chat/getMessages",
  async (conversationId, { rejectWithValue }) => {
    try {
      const result = unwrapResponse(
        await http.get(`/conversations/${conversationId}/messages`),
      );
      if (!Array.isArray(result?.items)) {
        throw new Error("Danh sách tin nhắn không hợp lệ");
      }
      return result;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Không thể tải tin nhắn"));
    }
  },
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ conversationId, content }, { rejectWithValue }) => {
    try {
      const message = unwrapResponse(
        await http.post(`/conversations/${conversationId}/messages`, {
          content,
        }),
      );
      if (!message?.id) {
        throw new Error("Dữ liệu tin nhắn không hợp lệ");
      }
      return message;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Gửi tin nhắn thất bại"));
    }
  },
);
