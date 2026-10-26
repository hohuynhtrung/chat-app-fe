import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ChatbotMessages from "@/pages/Chatbot/components/ChatbotMessage";
import ChatbotInput from "@/pages/Chatbot/components/ChatbotInput";

import { clearChatbotError } from "@/features/chatbot/chatbotSlice";
import pusher from "@/libs/pusher";

import {
  getChatbotMessages,
  sendChatbotMessage,
} from "@/service/chatbot/chatbotService";
import Header from "@/layouts/DefaultLayout/components/Header";

const Chatbot = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);

  const { messages, loadingMessages, sendingMessage, error } = useSelector(
    (state) => state.chatbot,
  );
  const [thinkingSteps, setThinkingSteps] = useState([]);
  const activeRequestIdRef = useRef(null);

  useEffect(() => {
    dispatch(getChatbotMessages(20));
  }, [dispatch]);

  useEffect(() => {
    if (!currentUser?.id) return undefined;

    const channelName = `agent-${currentUser.id}`;
    const channel = pusher.subscribe(channelName);

    const handleThinking = (event) => {
      if (
        event?.requestId !== activeRequestIdRef.current ||
        typeof event.thinking !== "string" ||
        !event.thinking
      ) {
        return;
      }

      setThinkingSteps((steps) => [
        ...steps,
        {
          id: `${event.requestId}-${event.step}`,
          content: event.thinking,
        },
      ]);
    };

    const handleComplete = (event) => {
      if (event?.requestId !== activeRequestIdRef.current) return;

      activeRequestIdRef.current = null;
      setThinkingSteps([]);
    };

    channel.bind("agent:thinking", handleThinking);
    channel.bind("agent:complete", handleComplete);

    return () => {
      activeRequestIdRef.current = null;
      channel.unbind("agent:thinking", handleThinking);
      channel.unbind("agent:complete", handleComplete);
      pusher.unsubscribe(channelName);
    };
  }, [currentUser?.id]);

  const handleSendMessage = async (content) => {
    dispatch(clearChatbotError());
    const requestId = crypto.randomUUID();
    activeRequestIdRef.current = requestId;
    setThinkingSteps([]);

    await dispatch(sendChatbotMessage({ input: content, requestId }));

    if (activeRequestIdRef.current === requestId) {
      activeRequestIdRef.current = null;
      setThinkingSteps([]);
    }
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
        thinkingSteps={thinkingSteps}
      />

      <ChatbotInput
        onSend={handleSendMessage}
        sendingMessage={sendingMessage}
      />
    </div>
  );
};

export default Chatbot;
