import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/features/auth/authSlice";
import chatReducer from "@/features/chat/chatSlice";
import chatbotReducer from "@/features/chatbot/chatbotSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    chatbot: chatbotReducer,
  },
});
