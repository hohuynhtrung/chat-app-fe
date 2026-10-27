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

export const getAgentConversations = createAsyncThunk(
  "chatbot/getConversations",
  async (_, { rejectWithValue }) => {
    try {
      const conversations = unwrapResponse(await http.get("/conversations"));

      if (!Array.isArray(conversations)) {
        throw new Error("Danh sách cuộc trò chuyện không hợp lệ");
      }

      return conversations;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Không thể tải danh sách cuộc trò chuyện"),
      );
    }
  },
);

export const createAgentConversation = createAsyncThunk(
  "chatbot/createConversation",
  async (_, { rejectWithValue }) => {
    try {
      const conversation = unwrapResponse(await http.post("/conversations", {}));

      if (!conversation?.id) {
        throw new Error("Dữ liệu cuộc trò chuyện mới không hợp lệ");
      }

      return conversation;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Không thể tạo cuộc trò chuyện mới"),
      );
    }
  },
);

export const renameAgentConversation = createAsyncThunk(
  "chatbot/renameConversation",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const conversation = unwrapResponse(
        await http.patch(`/conversations/${encodeURIComponent(id)}`, { name }),
      );

      if (conversation?.id !== id || typeof conversation.name !== "string") {
        throw new Error("Dữ liệu cuộc trò chuyện không hợp lệ");
      }

      return conversation;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Không thể đổi tên cuộc trò chuyện"),
      );
    }
  },
);

export const deleteAgentConversation = createAsyncThunk(
  "chatbot/deleteConversation",
  async (id, { rejectWithValue }) => {
    try {
      const result = unwrapResponse(
        await http.del(`/conversations/${encodeURIComponent(id)}`),
      );

      if (result?.id !== id) {
        throw new Error("Phản hồi xóa cuộc trò chuyện không hợp lệ");
      }

      return result;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Không thể xóa cuộc trò chuyện"),
      );
    }
  },
);

export const getAgentConversationMessages = createAsyncThunk(
  "chatbot/getConversationMessages",
  async (conversationId, { rejectWithValue }) => {
    try {
      const messages = unwrapResponse(
        await http.get(
          `/conversations/${encodeURIComponent(conversationId)}/messages`,
        ),
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

export const sendChatbotMessage = createAsyncThunk(
  "chatbot/sendMessage",
  async (payload, { rejectWithValue }) => {
    try {
      const message = unwrapResponse(
        await http.post("/agentMessage/chat", {
          input: payload.input,
          requestId: payload.requestId,
          conversationId: payload.conversationId,
        }),
      );

      if (
        !message?.id ||
        typeof message.content !== "string" ||
        message.conversationId !== payload.conversationId
      ) {
        throw new Error("Dữ liệu tin nhắn từ AI không hợp lệ");
      }

      return message;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Gửi tin nhắn thất bại"));
    }
  },
);
