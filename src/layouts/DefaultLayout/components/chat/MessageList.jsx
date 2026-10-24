import { useEffect, useMemo, useRef } from "react";
import MessageItem from "./MessageItem";
import { getMessageDate } from "@/utils/messageTime";

function MessageList({ messages, currentUserId, loading, conversationId }) {
  const messagesEndRef = useRef(null);

  // Sắp xếp tin nhắn theo thời gian tăng dần
  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      const dateA = getMessageDate(a);
      const dateB = getMessageDate(b);

      if (!dateA && !dateB) return 0;
      if (!dateA) return -1;
      if (!dateB) return 1;

      return dateA.getTime() - dateB.getTime();
    });
  }, [messages]);

  // Cuộn xuống cuối khi đổi hội thoại hoặc có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [sortedMessages, conversationId, loading]);

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-6">
      {loading ? (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Đang tải tin nhắn...
        </div>
      ) : sortedMessages.length === 0 ? (
        <div className="flex h-full items-center justify-center text-sm text-gray-400">
          Chưa có tin nhắn nào. Hãy gửi lời chào đầu tiên!
        </div>
      ) : (
        sortedMessages.map((message, index) => {
          const previousMessage = index > 0 ? sortedMessages[index - 1] : null;

          return (
            <MessageItem
              key={message.id}
              message={message}
              previousMessage={previousMessage}
              isMe={message.senderId === currentUserId}
              isFirstMessage={index === 0}
            />
          );
        })
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;
