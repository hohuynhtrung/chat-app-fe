import { useState, useEffect, useRef } from "react";
import {
  useCurrentUser,
  useAppDispatch,
  useAppSelector,
} from "@/features/auth/hook";
import {
  getConversations,
  createDmConversation,
  getMessages,
  sendMessage,
} from "@/service/chatpvsp/chatpvspService";
import {
  setActiveConversation,
  addIncomingMessage,
} from "@/features/conversation/conversationSlice";
import pusher from "@/libs/pusher";

function ChatPvsP() {
  const dispatch = useAppDispatch();
  const currentUser = useCurrentUser();

  const {
    conversations,
    activeConversation,
    messages,
    loadingConversations,
    loadingMessages,
    creatingConversation,
    sendingMessage,
    error,
  } = useAppSelector((state) => state.chat || {});

  const safeConversations = Array.isArray(conversations) ? conversations : [];
  const safeMessages = Array.isArray(messages) ? messages : [];

  const [newMessage, setNewMessage] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [otherUserId, setOtherUserId] = useState("");

  const messagesEndRef = useRef(null);

  // Lấy danh sách hội thoại khi vào trang
  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  // Lấy tin nhắn khi đổi cuộc hội thoại
  useEffect(() => {
    if (activeConversation?.id) {
      dispatch(getMessages(activeConversation.id));
    }
  }, [dispatch, activeConversation?.id]);

  // Lắng nghe realtime bằng pusher
  useEffect(() => {
    if (!activeConversation?.id) return;
    const channelName = `conversation-${activeConversation.id}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("message:created", (incomingMessage) => {
      dispatch(addIncomingMessage(incomingMessage));
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
    };
  }, [activeConversation?.id, dispatch]);

  // Tự động cuộn xuống cuối
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    dispatch(
      sendMessage({
        conversationId: activeConversation.id,
        content: newMessage,
      }),
    ).then((action) => {
      if (sendMessage.fulfilled.match(action)) setNewMessage("");
    });
  };

  const handleCreateDm = (e) => {
    e.preventDefault();
    if (!otherUserId.trim()) return;

    dispatch(createDmConversation(otherUserId.trim())).then((action) => {
      if (createDmConversation.fulfilled.match(action)) {
        setShowNewChatModal(false);
        setOtherUserId("");
      }
    });
  };

  const getConversationDisplayName = (conv) => {
    if (conv.type === "group") return conv.name || "Nhóm chưa đặt tên";
    const otherMember = conv.members?.find((m) => m.id !== currentUser?.id);
    return otherMember?.username || "Đoạn chat trống";
  };

  return (
    <div className="flex h-[calc(100vh-65px)] w-full overflow-hidden bg-white dark:bg-gray-900">
      {/* CỘT TRÁI: Danh sách cuộc hội thoại */}
      <div className="flex w-1/3 flex-col border-r border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Đoạn chat
          </h2>
          <button
            onClick={() => setShowNewChatModal(true)}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 cursor-pointer"
          >
            + Tin nhắn mới
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingConversations ? (
            <div className="p-4 text-center text-sm text-gray-500">
              Đang tải danh sách...
            </div>
          ) : safeConversations.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              Chưa có cuộc hội thoại nào
            </div>
          ) : (
            safeConversations.map((conv) => {
              const isActive = activeConversation?.id === conv.id;
              const displayName = getConversationDisplayName(conv);

              return (
                <div
                  key={conv.id}
                  onClick={() => dispatch(setActiveConversation(conv))}
                  className={`flex cursor-pointer items-center gap-3 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    isActive ? "bg-indigo-50 dark:bg-gray-800/80" : ""
                  }`}
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                    {displayName?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {displayName}
                    </h4>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* CỘT PHẢI: Khung chat chi tiết */}
      <div className="flex flex-1 flex-col bg-gray-50 dark:bg-gray-950">
        {error && (
          <div
            role="alert"
            className="border-b border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
          >
            {error}
          </div>
        )}
        {activeConversation ? (
          <>
            <div className="flex items-center border-b border-gray-200 bg-white px-6 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                {getConversationDisplayName(activeConversation)}
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loadingMessages ? (
                <div className="text-center text-sm text-gray-500">
                  Đang tải tin nhắn...
                </div>
              ) : (
                safeMessages.map((msg) => {
                  const isMe = msg.senderId === currentUser?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-md rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                          isMe
                            ? "bg-indigo-600 text-white rounded-br-none"
                            : "bg-white text-gray-900 border border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 rounded-bl-none"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSendMessage}
              className="flex items-center border-t border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={sendingMessage}
                placeholder="Nhập tin nhắn..."
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <button
                type="submit"
                disabled={sendingMessage || !newMessage.trim()}
                className="ml-3 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 cursor-pointer"
              >
                Gửi
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-400">
            Chọn một cuộc hội thoại để bắt đầu nhắn tin
          </div>
        )}
      </div>

      {/* MODAL TẠO CHAT DM */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Nhắn tin mới
            </h3>
            <form onSubmit={handleCreateDm} className="space-y-4">
              <input
                type="text"
                required
                value={otherUserId}
                onChange={(e) => setOtherUserId(e.target.value)}
                placeholder="Nhập User ID..."
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewChatModal(false)}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={creatingConversation}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                >
                  {creatingConversation ? "Đang tạo..." : "Tạo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatPvsP;
