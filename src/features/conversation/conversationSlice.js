import { createSlice } from "@reduxjs/toolkit";
import {
  getConversations,
  createDmConversation,
  getMessages,
  sendMessage,
} from "@/service/chatpvsp/chatpvspService";

const initialState = {
  conversations: [],
  activeConversation: null,
  messages: [],
  loadingConversations: false,
  loadingMessages: false,
  creatingConversation: false,
  sendingMessage: false,
  error: null,
  messagesRequestId: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation(state, action) {
      if (state.activeConversation?.id === action.payload?.id) return;

      state.activeConversation = action.payload;
      state.messages = [];
      state.loadingMessages = false;
      state.messagesRequestId = null;
      state.error = null;
    },
    addIncomingMessage(state, action) {
      const message = action.payload;
      if (
        message.conversationId === state.activeConversation?.id &&
        !state.messages.some((m) => m.id === message.id)
      ) {
        state.messages.push(message);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConversations.pending, (state) => {
        state.loadingConversations = true;
        state.error = null;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.loadingConversations = false;
        state.conversations = action.payload;
        const activeConversation = action.payload.find(
          (conversation) => conversation.id === state.activeConversation?.id,
        );
        if (activeConversation) {
          state.activeConversation = activeConversation;
        } else {
          state.activeConversation = action.payload[0] || null;
          state.messages = [];
          state.loadingMessages = false;
          state.messagesRequestId = null;
        }
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.loadingConversations = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(createDmConversation.pending, (state) => {
        state.creatingConversation = true;
        state.error = null;
      })
      .addCase(createDmConversation.fulfilled, (state, action) => {
        state.creatingConversation = false;
        const conversation = action.payload;
        const index = state.conversations.findIndex(
          (item) => item.id === conversation.id,
        );
        if (index === -1) {
          state.conversations.unshift(conversation);
        } else {
          state.conversations[index] = conversation;
        }
        state.activeConversation = conversation;
        state.messages = [];
        state.loadingMessages = false;
        state.messagesRequestId = null;
      })
      .addCase(createDmConversation.rejected, (state, action) => {
        state.creatingConversation = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(getMessages.pending, (state, action) => {
        if (state.activeConversation?.id === action.meta.arg) {
          state.loadingMessages = true;
          state.messages = [];
          state.messagesRequestId = action.meta.requestId;
          state.error = null;
        }
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        if (
          state.activeConversation?.id === action.meta.arg &&
          state.messagesRequestId === action.meta.requestId
        ) {
          state.loadingMessages = false;
          state.messages = action.payload.items;
          state.messagesRequestId = null;
        }
      })
      .addCase(getMessages.rejected, (state, action) => {
        if (
          state.activeConversation?.id === action.meta.arg &&
          state.messagesRequestId === action.meta.requestId
        ) {
          state.loadingMessages = false;
          state.messagesRequestId = null;
          state.error = action.payload || action.error.message;
        }
      })

      .addCase(sendMessage.pending, (state) => {
        state.sendingMessage = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendingMessage = false;
        if (
          action.payload.conversationId === state.activeConversation?.id &&
          !state.messages.some((message) => message.id === action.payload.id)
        ) {
          state.messages.push(action.payload);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingMessage = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setActiveConversation, addIncomingMessage } = chatSlice.actions;
export default chatSlice.reducer;
