import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ChatbotMessages from "@/pages/Chatbot/components/ChatbotMessage";
import ChatbotInput from "@/pages/Chatbot/components/ChatbotInput";

import { clearChatbotError } from "@/features/chatbot/chatbotSlice";

import {
  getChatbotMessages,
  sendChatbotMessage,
} from "@/service/chatbot/chatbotService";
import Header from "@/layouts/DefaultLayout/components/Header";

const Chatbot = () => {
  const dispatch = useDispatch();

  const { messages, loadingMessages, sendingMessage, error } = useSelector(
    (state) => state.chatbot,
  );

  useEffect(() => {
    dispatch(getChatbotMessages(20));
  }, [dispatch]);

  const handleSendMessage = (content) => {
    dispatch(clearChatbotError());
    dispatch(sendChatbotMessage(content));
  };

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Header />

      {error && (
        <div
          role="alert"
          className="flex shrink-0 items-start justify-between gap-3 border-b border-red-100 bg-red-50 px-5 py-3 dark:border-red-900 dark:bg-red-950/50"
        >
          <p className="text-[13px] text-red-600 dark:text-red-300">{error}</p>

          <button
            type="button"
            onClick={() => dispatch(clearChatbotError())}
            aria-label="Đóng thông báo lỗi"
            className="shrink-0 text-red-500 hover:text-red-700 dark:text-red-300 dark:hover:text-red-100"
          >
            ✕
          </button>
        </div>
      )}

      <ChatbotMessages
        messages={messages}
        loadingMessages={loadingMessages}
        sendingMessage={sendingMessage}
      />

      <ChatbotInput
        onSend={handleSendMessage}
        sendingMessage={sendingMessage}
      />
    </div>
  );
};

export default Chatbot;
