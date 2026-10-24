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

// Lấy lịch sử trò chuyện
export const getChatbotMessages = createAsyncThunk(
  "chatbot/getMessages",
  async (limit = 20, { rejectWithValue }) => {
    try {
      const messages = unwrapResponse(
        await http.get("/agentMessage/messages", {
          params: { limit },
        }),
      );

      if (!Array.isArray(messages)) {
        throw new Error("Danh sách tin nhắn không hợp lệ");
      }

      return messages;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Không thể tải lịch sử trò chuyện"),
      );
    }
  },
);

// Gửi tin nhắn cho AI
export const sendChatbotMessage = createAsyncThunk(
  "chatbot/sendMessage",
  async (input, { rejectWithValue }) => {
    try {
      const message = unwrapResponse(
        await http.post("/agentMessage/chat", { input }),
      );

      if (!message?.id || typeof message.content !== "string") {
        throw new Error("Dữ liệu tin nhắn từ AI không hợp lệ");
      }

      return message;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Gửi tin nhắn thất bại"));
    }
  },
);
