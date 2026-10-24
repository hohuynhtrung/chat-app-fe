import { useDispatch } from "react-redux";
import { clearChatbotMessages } from "@/features/chatbot/chatbotSlice";

const ChatbotHeader = () => {
  const dispatch = useDispatch();

  const handleNewChat = () => {
    dispatch(clearChatbotMessages());
  };

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-900 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-6 w-6"
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
          <h1 className="text-base font-semibold text-gray-900">Tiểu Mỹ AI</h1>

          <div className="mt-1 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs text-gray-500">Trợ lý AI</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleNewChat}
        className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
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
    </header>
  );
};

export default ChatbotHeader;
