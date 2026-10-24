const formatTime = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ChatbotMessageItem = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-xs font-semibold text-white">
          AI
        </div>
      )}

      <div
        className={`flex max-w-[85%] flex-col sm:max-w-[75%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-7 ${
            isUser
              ? "rounded-br-md bg-gray-900 text-white"
              : "rounded-bl-md border border-gray-100 bg-gray-50 text-gray-800"
          }`}
        >
          <p className="whitespace-pre-wrap wrap-break-word">
            {message.content}
          </p>
        </div>

        <div className="mt-1 flex items-center gap-2 px-1">
          <span className="text-[11px] text-gray-400">
            {formatTime(message.createdAt)}
          </span>

          {message.isTemporary && (
            <span className="text-[11px] text-gray-400">Đang gửi...</span>
          )}

          {message.failed && (
            <span className="text-[11px] text-red-500">Gửi thất bại</span>
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xs font-semibold text-blue-700">
          Bạn
        </div>
      )}
    </div>
  );
};

export default ChatbotMessageItem;
