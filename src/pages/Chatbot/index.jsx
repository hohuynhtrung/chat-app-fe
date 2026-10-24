import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ChatbotHeader from "@/pages/Chatbot/components/ChatbotHeader";
import ChatbotMessages from "@/pages/Chatbot/components/ChatbotMessage";
import ChatbotInput from "@/pages/Chatbot/components/ChatbotInput";

import { clearChatbotError } from "@/features/chatbot/chatbotSlice";

import {
  getChatbotMessages,
  sendChatbotMessage,
} from "@/service/chatbot/chatbotService";

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
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white">
      <ChatbotHeader />

      {error && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 border-b border-red-100 bg-red-50 px-5 py-3"
        >
          <p className="text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={() => dispatch(clearChatbotError())}
            aria-label="Đóng thông báo lỗi"
            className="shrink-0 text-red-500 hover:text-red-700"
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
