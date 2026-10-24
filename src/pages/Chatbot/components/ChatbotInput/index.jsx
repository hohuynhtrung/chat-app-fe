import { useState } from "react";

const ChatbotInput = ({ onSend, sendingMessage }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const content = input.trim();

    if (!content || sendingMessage) return;

    onSend(content);
    setInput("");
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-4 sm:px-6">
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
        <div className="flex items-end gap-3 rounded-2xl border border-gray-200 bg-white p-2 transition focus-within:border-gray-400 focus-within:shadow-sm">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tin nhắn cho Tiểu Mỹ AI..."
            maxLength={2000}
            rows={1}
            disabled={sendingMessage}
            className="max-h-40 min-h-11 flex-1 resize-none bg-transparent px-3 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
          />

          <button
            type="submit"
            disabled={!input.trim() || sendingMessage}
            aria-label="Gửi tin nhắn"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {sendingMessage ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 19V5m-7 7l7-7 7 7"
                />
              </svg>
            )}
          </button>
        </div>

        <p className="mt-2 text-center text-[11px] text-gray-400">
          AI có thể đưa ra thông tin chưa chính xác. Hãy kiểm tra lại những
          thông tin quan trọng.
        </p>
      </form>
    </div>
  );
};

export default ChatbotInput;
