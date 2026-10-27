import { useEffect, useRef, useState } from "react";
import ChatbotMessageItem from "@/pages/Chatbot/components/ChatbotMessageItem";

const ThinkingText = ({ content, animate }) => {
  const [visibleLength, setVisibleLength] = useState(0);

  useEffect(() => {
    if (!animate) return undefined;

    let length = 0;
    const timer = setInterval(() => {
      length += 1;
      setVisibleLength(length);

      if (length >= content.length) {
        clearInterval(timer);
      }
    }, 18);

    return () => clearInterval(timer);
  }, [animate, content]);

  return (
    <>
      {animate ? content.slice(0, visibleLength) : content}
      {animate && visibleLength < content.length && (
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-current align-middle"
        />
      )}
    </>
  );
};

const ChatbotMessages = ({
  messages = [],
  loadingMessages,
  sendingMessage,
  thinkingSteps = [],
  fileOperations = [],
}) => {
  const bottomRef = useRef(null);
  const thinkingWindowRef = useRef(null);

  useEffect(() => {
    const thinkingWindow = thinkingWindowRef.current;

    if (thinkingWindow) {
      thinkingWindow.scrollTo({
        top: thinkingWindow.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [thinkingSteps]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, sendingMessage, thinkingSteps]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-white p-4 dark:bg-gray-950 sm:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
        {loadingMessages && (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />

            <p className="text-[13px] text-gray-500 dark:text-gray-400">
              Đang tải lịch sử trò chuyện...
            </p>
          </div>
        )}

        {!loadingMessages && messages.length === 0 && (
          <div className="flex min-h-87.5 flex-col items-center justify-center text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gray-900 text-white shadow-lg dark:bg-gray-100 dark:text-gray-900">
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

            <h2 className="text-[19px] font-semibold text-gray-900 dark:text-gray-100">
              Xin chào! Tôi có thể giúp gì cho bạn?
            </h2>

            <p className="mt-2 max-w-md text-[13px] leading-6 text-gray-500 dark:text-gray-400">
              Hãy đặt câu hỏi, yêu cầu giải thích hoặc bắt đầu một công việc.
              Tôi cũng có thể đọc hoặc tạo/cập nhật file trong thư mục dự án.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                "Giải thích một đoạn code",
                "Đọc file README.md",
                "Tạo file ghi chú",
                "Hỗ trợ lập trình",
              ].map((suggestion) => (
                <span
                  key={suggestion}
                  className="rounded-full border border-gray-200 px-3 py-2 text-[11px] text-gray-600 dark:border-gray-700 dark:text-gray-300"
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

        {fileOperations.map((operation) => {
          const isRead = operation.action === "readFile";
          const actionLabel = isRead ? "Đọc file" : "Ghi file";
          const statusLabel =
            operation.status === "started"
              ? `Đang ${isRead ? "đọc" : "ghi"}...`
              : operation.success
                ? `${isRead ? "Đã đọc" : "Đã ghi"} thành công`
                : `${isRead ? "Không thể đọc" : "Không thể ghi"}`;

          return (
            <div
              key={operation.id}
              role="status"
              className="flex items-start gap-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  {isRead ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5.25A2.25 2.25 0 0 1 5.25 3H20.25v15H5.25A2.25 2.25 0 0 0 3 20.25v-15ZM3 17.25A2.25 2.25 0 0 1 5.25 15H20.25"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v12m0 0 4-4m-4 4-4-4M4.5 17.25v1.5A2.25 2.25 0 0 0 6.75 21h10.5a2.25 2.25 0 0 0 2.25-2.25v-1.5"
                    />
                  )}
                </svg>
              </div>

              <div className="min-w-0 max-w-[85%] rounded-2xl rounded-bl-md border border-blue-100 bg-blue-50/70 px-4 py-2.5 text-[12px] leading-5 dark:border-blue-900 dark:bg-blue-950/40">
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {actionLabel}
                  <span
                    className={`ml-2 ${
                      operation.status === "started"
                        ? "text-blue-600 dark:text-blue-300"
                        : operation.success
                          ? "text-green-700 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {statusLabel}
                  </span>
                </p>
                <p className="mt-1 break-all font-mono text-[11px] text-gray-600 dark:text-gray-300">
                  {operation.path}
                </p>
              </div>
            </div>
          );
        })}

        {sendingMessage && thinkingSteps.length > 0 && (
          <div className="flex items-start gap-3" aria-live="polite">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-[11px] font-semibold text-white dark:bg-gray-100 dark:text-gray-900">
              AI
            </div>

            <div
              ref={thinkingWindowRef}
              className="max-h-48 max-w-[85%] space-y-2 overflow-y-auto rounded-2xl rounded-bl-md border border-gray-100 bg-gray-50 px-4 py-3 text-[13px] leading-6 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            >
              {thinkingSteps.map((step, index) => (
                <p
                  key={step.id}
                  className={`whitespace-pre-wrap wrap-break-word transition-opacity duration-300 ${
                    index === thinkingSteps.length - 1
                      ? "opacity-100"
                      : "opacity-40"
                  }`}
                >
                  <ThinkingText
                    content={step.content}
                    animate={index === thinkingSteps.length - 1}
                  />
                </p>
              ))}
            </div>
          </div>
        )}

        {sendingMessage && thinkingSteps.length === 0 && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-[11px] font-semibold text-white dark:bg-gray-100 dark:text-gray-900">
              AI
            </div>

            <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-gray-100 bg-gray-50 px-4 py-4 dark:border-gray-800 dark:bg-gray-900">
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
