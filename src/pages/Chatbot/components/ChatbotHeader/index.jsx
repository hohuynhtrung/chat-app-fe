import { useDispatch } from "react-redux";
import { clearChatbotMessages } from "@/features/chatbot/chatbotSlice";
import ThemeToggle from "@/components/ThemeLayout/ThemeToggle";

const ChatbotHeader = () => {
  const dispatch = useDispatch();

  const handleNewChat = () => {
    dispatch(clearChatbotMessages());
  };

  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-200 bg-white px-3 py-3 dark:border-gray-800 dark:bg-gray-950 sm:px-5">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
          >
            <rect x="4" y="6" width="16" height="13" rx="4" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h.01M15 12h.01M9 15h6M12 6V3m-2 0h4"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">
            Chat App AI
          </h1>

          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              Trợ lý AI
            </span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={handleNewChat}
          className="flex h-9 items-center gap-2 rounded-xl border border-gray-200 px-2.5 text-[13px] font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 sm:px-3"
          title="Làm mới giao diện trò chuyện"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 5v14m-7-7h14"
            />
          </svg>

          <span className="hidden sm:inline">Cuộc trò chuyện mới</span>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default ChatbotHeader;
