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
} from "@/service/chat/chatService";
import {
  setActiveConversation,
  addIncomingMessage,
} from "@/features/chat/chatSlice";
import pusher from "@/libs/pusher";
import Header from "@/layouts/DefaultLayout/components/Header";

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
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <Header />

      <div className="flex h-[calc(100vh-65px)] w-full overflow-hidden bg-white dark:bg-gray-900">
        <div className="flex w-1/3 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Đoạn chat
            </h2>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 cursor-pointer dark:bg-indigo-600 dark:hover:bg-indigo-500"
            >
              + Tin nhắn mới
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/60">
            {loadingConversations ? (
              <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Đang tải danh sách...
              </div>
            ) : safeConversations.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
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
                    className={`flex cursor-pointer items-center gap-3.5 px-5 py-3.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                      isActive ? "bg-indigo-50/70 dark:bg-indigo-950/30" : ""
                    }`}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 shadow-sm">
                      {displayName?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {displayName}
                      </h4>
                      <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                        Nhấn để xem tin nhắn
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col bg-gray-50/50 dark:bg-gray-950">
          {error && (
            <div
              role="alert"
              className="border-b border-red-200 bg-red-50 px-6 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
            >
              {error}
            </div>
          )}

          {activeConversation ? (
            <>
              <div className="flex items-center border-b border-gray-200 bg-white px-6 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 text-sm">
                    {getConversationDisplayName(activeConversation)
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    {getConversationDisplayName(activeConversation)}
                  </h3>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loadingMessages ? (
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Đang tải tin nhắn...
                  </div>
                ) : safeMessages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">
                    Chưa có tin nhắn nào. Hãy gửi lời chào đầu tiên!
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
                              ? "bg-indigo-600 text-white rounded-br-xs"
                              : "bg-white text-gray-900 border border-gray-200 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-800 rounded-bl-xs"
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
                className="flex items-center gap-3 border-t border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900 shadow-lg"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={sendingMessage}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                />
                <button
                  type="submit"
                  disabled={sendingMessage || !newMessage.trim()}
                  className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50 cursor-pointer dark:bg-indigo-600 dark:hover:bg-indigo-500"
                >
                  Gửi
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm font-medium text-gray-400">
              Chọn một cuộc hội thoại để bắt đầu nhắn tin
            </div>
          )}
        </div>

        {/* MODAL TẠO CHAT DM */}
        {showNewChatModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Nhắn tin mới
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Nhập mã định danh (User ID) của người bạn muốn trò chuyện.
              </p>

              <form onSubmit={handleCreateDm} className="space-y-4">
                <input
                  type="text"
                  required
                  value={otherUserId}
                  onChange={(e) => setOtherUserId(e.target.value)}
                  placeholder="Nhập User ID..."
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                />
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewChatModal(false)}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={creatingConversation}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                  >
                    {creatingConversation ? "Đang tạo..." : "Tạo"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPvsP;
