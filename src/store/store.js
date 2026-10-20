import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/features/auth/authSlice";
import conversation from "@/features/conversation/conversationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: conversation,
  },
});
