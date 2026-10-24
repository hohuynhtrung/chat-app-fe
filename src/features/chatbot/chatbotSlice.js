import { createSlice } from "@reduxjs/toolkit";
import {
  getChatbotMessages,
  sendChatbotMessage,
} from "@/service/chatbot/chatbotService";

const initialState = {
  messages: [],
  loadingMessages: false,
  sendingMessage: false,
  error: null,
  messagesRequestId: null,
};

export const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,

  reducers: {
    clearChatbotError(state) {
      state.error = null;
    },

    clearChatbotMessages(state) {
      state.messages = [];
      state.error = null;
      state.messagesRequestId = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Lấy lịch sử trò chuyện
      .addCase(getChatbotMessages.pending, (state, action) => {
        state.loadingMessages = true;
        state.error = null;
        state.messagesRequestId = action.meta.requestId;
      })

      .addCase(getChatbotMessages.fulfilled, (state, action) => {
        if (state.messagesRequestId !== action.meta.requestId) return;

        state.loadingMessages = false;
        state.messages = action.payload;
        state.messagesRequestId = null;
      })

      .addCase(getChatbotMessages.rejected, (state, action) => {
        if (state.messagesRequestId !== action.meta.requestId) return;

        state.loadingMessages = false;
        state.messagesRequestId = null;
        state.error =
          action.payload ||
          action.error.message ||
          "Không thể tải lịch sử trò chuyện";
      })

      // Gửi tin nhắn
      .addCase(sendChatbotMessage.pending, (state, action) => {
        const input = action.meta.arg;

        state.sendingMessage = true;
        state.error = null;

        // Hiển thị tin nhắn người dùng ngay lập tức.
        // requestId giúp xác định chính xác tin nhắn của request này.
        state.messages.push({
          id: `temp-${action.meta.requestId}`,
          requestId: action.meta.requestId,
          role: "user",
          content: input,
          createdAt: new Date().toISOString(),
          isTemporary: true,
        });
      })

      .addCase(sendChatbotMessage.fulfilled, (state, action) => {
        state.sendingMessage = false;

        // Giữ lại tin nhắn người dùng sau khi gửi thành công.
        const userMessage = state.messages.find(
          (message) => message.requestId === action.meta.requestId,
        );

        if (userMessage) {
          userMessage.isTemporary = false;
          delete userMessage.requestId;
        }

        // Thêm phản hồi AI nếu chưa tồn tại.
        const assistantMessage = action.payload;
        const alreadyExists = state.messages.some(
          (message) => message.id === assistantMessage.id,
        );

        if (!alreadyExists) {
          state.messages.push(assistantMessage);
        }
      })

      .addCase(sendChatbotMessage.rejected, (state, action) => {
        state.sendingMessage = false;
        state.error =
          action.payload || action.error.message || "Gửi tin nhắn thất bại";

        // Đánh dấu tin nhắn gửi thất bại để giao diện có thể hiển thị trạng thái.
        const userMessage = state.messages.find(
          (message) => message.requestId === action.meta.requestId,
        );

        if (userMessage) {
          userMessage.isTemporary = false;
          userMessage.failed = true;
          delete userMessage.requestId;
        }
      });
  },
});

export const { clearChatbotError, clearChatbotMessages } = chatbotSlice.actions;

export default chatbotSlice.reducer;
