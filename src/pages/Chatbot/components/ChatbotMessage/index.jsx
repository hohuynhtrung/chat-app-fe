import { useEffect, useRef } from "react";
import ChatbotMessageItem from "@/pages/Chatbot/components/ChatbotMessageItem";

const ChatbotMessages = ({
  messages = [],
  loadingMessages,
  sendingMessage,
}) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, sendingMessage]);

  return (
    <div className="flex-1 overflow-y-auto bg-white px-4 py-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        {loadingMessages && (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />

            <p className="text-sm text-gray-500">
              Đang tải lịch sử trò chuyện...
            </p>
          </div>
        )}

        {!loadingMessages && messages.length === 0 && (
          <div className="flex min-h-87.5 flex-col items-center justify-center text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gray-900 text-white shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-8 w-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 15l1 2.5 2 1-2 1L19 22l-1-2.5-2-1 2-1 1-2.5z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              Xin chào! Tôi có thể giúp gì cho bạn?
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
              Hãy đặt câu hỏi, yêu cầu giải thích hoặc bắt đầu một công việc.
              Tôi sẽ cố gắng hỗ trợ bạn.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                "Giải thích một đoạn code",
                "Tìm kiếm thông tin",
                "Hỗ trợ lập trình",
              ].map((suggestion) => (
                <span
                  key={suggestion}
                  className="rounded-full border border-gray-200 px-3 py-2 text-xs text-gray-600"
                >
                  {suggestion}
                </span>
              ))}
            </div>
          </div>
        )}

        {!loadingMessages &&
          messages.map((message) => (
            <ChatbotMessageItem key={message.id} message={message} />
          ))}

        {sendingMessage && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-xs font-semibold text-white">
              AI
            </div>

            <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-gray-100 bg-gray-50 px-4 py-4">
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatbotMessages;
