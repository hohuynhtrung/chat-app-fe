import {
  getMessageDate,
  formatHoverTime,
  formatSeparatorTime,
  shouldShowTimestamp,
} from "@/utils/messageTime";

function MessageItem({ message, previousMessage, isMe, isFirstMessage }) {
  const messageDate = getMessageDate(message);
  const previousDate = getMessageDate(previousMessage);

  const showTimestamp = shouldShowTimestamp(
    messageDate,
    previousDate,
    isFirstMessage,
  );

  return (
    <div>
      {showTimestamp && (
        <div className="my-5 flex justify-center">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {formatSeparatorTime(messageDate, previousDate)}
          </span>
        </div>
      )}

      <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
        <div
          className={`relative flex max-w-[85%] items-center ${
            isMe ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <div
            className={`group relative wrap-break-word whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
              isMe
                ? "rounded-br-xs bg-indigo-600 text-white"
                : "rounded-bl-xs border border-gray-200 bg-white text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
            }`}
          >
            {message.content}

            {messageDate && (
              <span
                className={`pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-[11px] text-white opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100 dark:bg-gray-700 ${
                  isMe ? "right-full mr-2" : "left-full ml-2"
                }`}
              >
                {formatHoverTime(messageDate)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageItem;
