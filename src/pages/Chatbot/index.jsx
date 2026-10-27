import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ChatbotMessages from "@/pages/Chatbot/components/ChatbotMessage";
import ChatbotInput from "@/pages/Chatbot/components/ChatbotInput";

import {
  clearChatbotError,
  setActiveAgentConversation,
} from "@/features/chatbot/chatbotSlice";
import pusher from "@/libs/pusher";

import {
  createAgentConversation,
  deleteAgentConversation,
  getAgentConversationMessages,
  getAgentConversations,
  renameAgentConversation,
  sendChatbotMessage,
} from "@/service/chatbot/chatbotService";
import Header from "@/layouts/DefaultLayout/components/Header";

const Chatbot = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);

  const {
    conversations,
    activeConversationId,
    messages,
    loadingConversations,
    loadingMessages,
    creatingConversation,
    updatingConversationId,
    deletingConversationId,
    sendingMessage,
    error,
  } = useSelector((state) => state.chatbot);
  const [thinkingSteps, setThinkingSteps] = useState([]);
  const [renamingConversationId, setRenamingConversationId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(() =>
    window.matchMedia("(min-width: 768px)").matches,
  );
  const activeRequestIdRef = useRef(null);
  const initializedUserRef = useRef(null);
  const isSendingRef = useRef(false);

  useEffect(() => {
    if (!currentUser?.id || initializedUserRef.current === currentUser.id) {
      return;
    }

    initializedUserRef.current = currentUser.id;

    const initializeConversations = async () => {
      const result = await dispatch(getAgentConversations());

      if (!getAgentConversations.fulfilled.match(result)) return;

      if (result.payload.length === 0) {
        dispatch(setActiveAgentConversation(null));
        return;
      }

      const selectedConversation =
        result.payload.find(
          (conversation) => conversation.id === activeConversationId,
        ) || result.payload[0];

      dispatch(setActiveAgentConversation(selectedConversation.id));
      dispatch(getAgentConversationMessages(selectedConversation.id));
    };

    initializeConversations();
  }, [activeConversationId, currentUser?.id, dispatch]);

  useEffect(() => {
    if (!currentUser?.id) return undefined;

    const channelName = `agent-${currentUser.id}`;
    const channel = pusher.subscribe(channelName);

    const handleThinking = (event) => {
      if (
        event?.requestId !== activeRequestIdRef.current ||
        typeof event.thinking !== "string" ||
        !event.thinking
      ) {
        return;
      }

      setThinkingSteps((steps) => [
        ...steps,
        {
          id: `${event.requestId}-${event.step}`,
          content: event.thinking,
        },
      ]);
    };

    const handleComplete = (event) => {
      if (event?.requestId !== activeRequestIdRef.current) return;

      activeRequestIdRef.current = null;
      setThinkingSteps([]);
    };

    channel.bind("agent:thinking", handleThinking);
    channel.bind("agent:complete", handleComplete);

    return () => {
      activeRequestIdRef.current = null;
      channel.unbind("agent:thinking", handleThinking);
      channel.unbind("agent:complete", handleComplete);
      pusher.unsubscribe(channelName);
    };
  }, [currentUser?.id]);

  const selectConversation = useCallback(
    (conversationId) => {
      if (conversationId === activeConversationId) {
        setIsSidebarOpen(false);
        return;
      }

      activeRequestIdRef.current = null;
      setThinkingSteps([]);
      dispatch(setActiveAgentConversation(conversationId));
      dispatch(getAgentConversationMessages(conversationId));
      setIsSidebarOpen(false);
    },
    [activeConversationId, dispatch],
  );

  const handleNewConversation = async () => {
    activeRequestIdRef.current = null;
    setThinkingSteps([]);
    dispatch(setActiveAgentConversation(null));
    setIsSidebarOpen(false);
  };

  const beginRenameConversation = (conversation) => {
    setRenamingConversationId(conversation.id);
    setRenameValue(conversation.name || "");
  };

  const handleRenameConversation = async (event, conversationId) => {
    event.preventDefault();
    const result = await dispatch(
      renameAgentConversation({ id: conversationId, name: renameValue }),
    );

    if (renameAgentConversation.fulfilled.match(result)) {
      setRenamingConversationId(null);
      setRenameValue("");
    }
  };

  const handleDeleteConversation = async (conversation) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa cuộc trò chuyện "${conversation.name || "Cuộc trò chuyện mới"}"?`,
    );
    if (!confirmed) return;

    const wasActive = conversation.id === activeConversationId;
    const remainingConversations = conversations.filter(
      (item) => item.id !== conversation.id,
    );
    const result = await dispatch(deleteAgentConversation(conversation.id));

    if (!deleteAgentConversation.fulfilled.match(result) || !wasActive) return;

    activeRequestIdRef.current = null;
    setThinkingSteps([]);

    if (remainingConversations.length > 0) {
      selectConversation(remainingConversations[0].id);
      return;
    }

    dispatch(setActiveAgentConversation(null));
  };

  const handleSendMessage = async (content) => {
    if (isSendingRef.current) return;
    isSendingRef.current = true;

    dispatch(clearChatbotError());
    const requestId = crypto.randomUUID();
    activeRequestIdRef.current = requestId;
    setThinkingSteps([]);

    let conversationId = activeConversationId;

    try {
      if (!conversationId) {
        const createResult = await dispatch(createAgentConversation());

        if (!createAgentConversation.fulfilled.match(createResult)) {
          return;
        }

        conversationId = createResult.payload.id;
      }

      await dispatch(
        sendChatbotMessage({
          input: content,
          requestId,
          conversationId,
        }),
      );
    } finally {
      isSendingRef.current = false;
      if (activeRequestIdRef.current === requestId) {
        activeRequestIdRef.current = null;
        setThinkingSteps([]);
      }
    }
  };

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Header />

      <div className="relative flex min-h-0 flex-1">
        {isSidebarOpen && (
          <button
            type="button"
            aria-label="Đóng danh sách cuộc trò chuyện"
            onClick={() => setIsSidebarOpen(false)}
            className="absolute inset-0 z-20 bg-black/30 md:hidden"
          />
        )}

        <aside
          className={`absolute inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-gray-200 bg-gray-50 transition-transform dark:border-gray-800 dark:bg-gray-900 md:relative md:z-0 md:translate-x-0 ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:hidden"
          }`}
          aria-label="Danh sách cuộc trò chuyện"
        >
          <div className="flex items-center justify-between gap-2 p-3">
            <button
              type="button"
              onClick={handleNewConversation}
              disabled={loadingConversations || creatingConversation}
              className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-wait disabled:opacity-60 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
            >
              <span aria-hidden="true" className="text-lg leading-none">+</span>
              Cuộc trò chuyện mới
            </button>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Đóng thanh bên"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 md:hidden dark:hover:bg-gray-800"
            >
              ✕
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
            <h2 className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Gần đây
            </h2>

            {loadingConversations && conversations.length === 0 && (
              <p className="px-2 py-3 text-sm text-gray-500 dark:text-gray-400">
                Đang tải cuộc trò chuyện...
              </p>
            )}

            {!loadingConversations && conversations.length === 0 && (
              <p className="px-2 py-3 text-sm text-gray-500 dark:text-gray-400">
                Chưa có cuộc trò chuyện nào.
              </p>
            )}

            <ul className="space-y-1">
              {conversations.map((conversation) => {
                const preview =
                  conversation.agentMessages?.[0]?.content ||
                  "Bắt đầu cuộc trò chuyện";
                const isActive = conversation.id === activeConversationId;
                const isRenaming =
                  conversation.id === renamingConversationId;
                const isUpdating =
                  conversation.id === updatingConversationId;
                const isDeleting =
                  conversation.id === deletingConversationId;

                return (
                  <li
                    key={conversation.id}
                    className={`group rounded-xl transition ${
                      isActive
                        ? "bg-white shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700"
                        : "hover:bg-white dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-start gap-1 p-1">
                      {isRenaming ? (
                        <form
                          onSubmit={(event) =>
                            handleRenameConversation(event, conversation.id)
                          }
                          className="min-w-0 flex-1 p-1"
                        >
                          <input
                            autoFocus
                            value={renameValue}
                            onChange={(event) =>
                              setRenameValue(event.target.value)
                            }
                            maxLength={100}
                            aria-label="Tên cuộc trò chuyện"
                            className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-800 outline-none focus:border-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                          />
                          <div className="mt-2 flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setRenamingConversationId(null)}
                              disabled={isUpdating}
                              className="rounded-lg px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              Hủy
                            </button>
                            <button
                              type="submit"
                              disabled={!renameValue.trim() || isUpdating}
                              className="rounded-lg bg-gray-900 px-2 py-1 text-xs font-medium text-white disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900"
                            >
                              {isUpdating ? "Đang lưu..." : "Lưu"}
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => selectConversation(conversation.id)}
                            aria-current={isActive ? "page" : undefined}
                            className="min-w-0 flex-1 px-2 py-1.5 text-left"
                          >
                            <span className="block truncate text-sm font-medium text-gray-800 dark:text-gray-100">
                              {conversation.name || "Cuộc trò chuyện mới"}
                            </span>
                            <span className="mt-1 block truncate text-xs text-gray-500 dark:text-gray-400">
                              {preview}
                            </span>
                          </button>

                          <div className="flex shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                beginRenameConversation(conversation)
                              }
                              aria-label={`Đổi tên ${conversation.name || "cuộc trò chuyện"}`}
                              title="Đổi tên"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 opacity-70 hover:bg-gray-100 hover:text-gray-900 group-hover:opacity-100 focus:opacity-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
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
                                  d="m16.862 4.487 2.651 2.651M5 19l4.25-.85L19.2 8.2a1.875 1.875 0 0 0-2.65-2.65L6.6 15.5 5 19z"
                                />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteConversation(conversation)
                              }
                              disabled={sendingMessage || isDeleting}
                              aria-label={`Xóa ${conversation.name || "cuộc trò chuyện"}`}
                              title="Xóa"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 opacity-70 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 group-hover:opacity-100 focus:opacity-100 dark:text-gray-400 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                            >
                              {isDeleting ? (
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              ) : (
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
                                    d="M4 7h16M10 11v6m4-6v6M5.5 7l1 13h11l1-13M9 7V4h6v3"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-12 shrink-0 items-center gap-3 border-b border-gray-100 px-3 dark:border-gray-800 sm:px-5">
            <button
              type="button"
              onClick={() => setIsSidebarOpen((open) => !open)}
              aria-label={
                isSidebarOpen
                  ? "Đóng danh sách cuộc trò chuyện"
                  : "Mở danh sách cuộc trò chuyện"
              }
              aria-expanded={isSidebarOpen}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M9 4v16" />
              </svg>
            </button>
            <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">
              {conversations.find(
                (conversation) => conversation.id === activeConversationId,
              )?.name || "Cuộc trò chuyện mới"}
            </p>
          </div>

          {error && (
        <div
          role="alert"
          className="flex shrink-0 items-start justify-between gap-3 border-b border-red-100 bg-red-50 px-5 py-3 dark:border-red-900 dark:bg-red-950/50"
        >
          <p className="text-[13px] text-red-600 dark:text-red-300">{error}</p>

          <button
            type="button"
            onClick={() => dispatch(clearChatbotError())}
            aria-label="Đóng thông báo lỗi"
            className="shrink-0 text-red-500 hover:text-red-700 dark:text-red-300 dark:hover:text-red-100"
          >
            ✕
          </button>
        </div>
      )}

          <ChatbotMessages
            messages={messages}
            loadingMessages={loadingMessages}
            sendingMessage={sendingMessage}
            thinkingSteps={thinkingSteps}
          />

          <ChatbotInput
            onSend={handleSendMessage}
            sendingMessage={sendingMessage || creatingConversation}
          />
        </main>
      </div>
    </div>
  );
};

export default Chatbot;
