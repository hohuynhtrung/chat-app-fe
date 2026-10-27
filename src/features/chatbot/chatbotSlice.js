import { createSlice } from "@reduxjs/toolkit";
import {
  createAgentConversation,
  deleteAgentConversation,
  getAgentConversationMessages,
  getAgentConversations,
  renameAgentConversation,
  sendChatbotMessage,
} from "@/service/chatbot/chatbotService";

const initialState = {
  conversations: [],
  activeConversationId: null,
  messages: [],
  loadingConversations: false,
  loadingMessages: false,
  creatingConversation: false,
  updatingConversationId: null,
  deletingConversationId: null,
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

    setActiveAgentConversation(state, action) {
      if (state.activeConversationId === action.payload) return;

      state.activeConversationId = action.payload;
      state.messages = [];
      state.loadingMessages = false;
      state.messagesRequestId = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAgentConversations.pending, (state) => {
        state.loadingConversations = true;
        state.error = null;
      })
      .addCase(getAgentConversations.fulfilled, (state, action) => {
        state.loadingConversations = false;
        state.conversations = action.payload;
      })
      .addCase(getAgentConversations.rejected, (state, action) => {
        state.loadingConversations = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(createAgentConversation.pending, (state) => {
        state.creatingConversation = true;
        state.error = null;
      })
      .addCase(createAgentConversation.fulfilled, (state, action) => {
        state.creatingConversation = false;
        const conversation = action.payload;
        state.conversations = [
          conversation,
          ...state.conversations.filter((item) => item.id !== conversation.id),
        ];
        state.activeConversationId = conversation.id;
        state.messages = [];
        state.loadingMessages = false;
        state.messagesRequestId = null;
      })
      .addCase(createAgentConversation.rejected, (state, action) => {
        state.creatingConversation = false;
        state.error =
          action.payload || action.error.message || "Không thể tạo cuộc trò chuyện";
      })

      .addCase(renameAgentConversation.pending, (state, action) => {
        state.updatingConversationId = action.meta.arg.id;
        state.error = null;
      })
      .addCase(renameAgentConversation.fulfilled, (state, action) => {
        state.updatingConversationId = null;
        const index = state.conversations.findIndex(
          (item) => item.id === action.payload.id,
        );
        if (index !== -1) {
          state.conversations[index] = {
            ...state.conversations[index],
            ...action.payload,
          };
        }
      })
      .addCase(renameAgentConversation.rejected, (state, action) => {
        state.updatingConversationId = null;
        state.error =
          action.payload || action.error.message || "Không thể đổi tên cuộc trò chuyện";
      })

      .addCase(deleteAgentConversation.pending, (state, action) => {
        state.deletingConversationId = action.meta.arg;
        state.error = null;
      })
      .addCase(deleteAgentConversation.fulfilled, (state, action) => {
        state.deletingConversationId = null;
        state.conversations = state.conversations.filter(
          (item) => item.id !== action.payload.id,
        );
        if (state.activeConversationId === action.payload.id) {
          state.activeConversationId = null;
          state.messages = [];
          state.loadingMessages = false;
          state.messagesRequestId = null;
        }
      })
      .addCase(deleteAgentConversation.rejected, (state, action) => {
        state.deletingConversationId = null;
        state.error =
          action.payload || action.error.message || "Không thể xóa cuộc trò chuyện";
      })

      .addCase(getAgentConversationMessages.pending, (state, action) => {
        if (state.activeConversationId !== action.meta.arg) return;

        state.loadingMessages = true;
        state.messages = [];
        state.messagesRequestId = action.meta.requestId;
        state.error = null;
      })
      .addCase(getAgentConversationMessages.fulfilled, (state, action) => {
        if (
          state.activeConversationId !== action.meta.arg ||
          state.messagesRequestId !== action.meta.requestId
        ) {
          return;
        }

        state.loadingMessages = false;
        state.messages = action.payload;
        state.messagesRequestId = null;
      })
      .addCase(getAgentConversationMessages.rejected, (state, action) => {
        if (
          state.activeConversationId !== action.meta.arg ||
          state.messagesRequestId !== action.meta.requestId
        ) {
          return;
        }

        state.loadingMessages = false;
        state.messagesRequestId = null;
        state.error = action.payload || action.error.message;
      })

      .addCase(sendChatbotMessage.pending, (state, action) => {
        state.sendingMessage = true;
        state.error = null;
        const conversation = state.conversations.find(
          (item) => item.id === action.meta.arg.conversationId,
        );
        if (conversation) {
          if (conversation.name === "Cuộc trò chuyện mới") {
            conversation.name = action.meta.arg.input.slice(0, 80);
          }
          conversation.lastMessageAt = new Date().toISOString();
        }
        state.messages.push({
          id: `temp-${action.meta.requestId}`,
          requestId: action.meta.requestId,
          role: "user",
          content: action.meta.arg.input,
          conversationId: action.meta.arg.conversationId,
          createdAt: new Date().toISOString(),
          isTemporary: true,
        });
      })
      .addCase(sendChatbotMessage.fulfilled, (state, action) => {
        state.sendingMessage = false;

        if (state.activeConversationId !== action.meta.arg.conversationId) {
          return;
        }

        const conversation = state.conversations.find(
          (item) => item.id === action.meta.arg.conversationId,
        );
        const userMessage = state.messages.find(
          (message) => message.requestId === action.meta.requestId,
        );
        if (userMessage) {
          userMessage.isTemporary = false;
          if (conversation?.name === "Cuộc trò chuyện mới") {
            conversation.name = userMessage.content.slice(0, 80);
          }
          delete userMessage.requestId;
        }

        if (!state.messages.some((message) => message.id === action.payload.id)) {
          state.messages.push(action.payload);
        }

        if (conversation) {
          conversation.lastMessageAt = action.payload.createdAt;
          conversation.agentMessages = [
            {
              content: action.payload.content,
              createdAt: action.payload.createdAt,
            },
          ];
        }
        state.conversations.sort(
          (first, second) =>
            new Date(second.lastMessageAt) - new Date(first.lastMessageAt),
        );
      })
      .addCase(sendChatbotMessage.rejected, (state, action) => {
        state.sendingMessage = false;

        if (state.activeConversationId !== action.meta.arg.conversationId) {
          return;
        }

        state.error =
          action.payload || action.error.message || "Gửi tin nhắn thất bại";

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

export const { clearChatbotError, setActiveAgentConversation } =
  chatbotSlice.actions;

export default chatbotSlice.reducer;
