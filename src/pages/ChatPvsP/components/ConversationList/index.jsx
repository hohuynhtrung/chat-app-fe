function ConversationList({
  className = "",
  conversations,
  activeConversation,
  loading,
  getDisplayName,
  onSelectConversation,
  onNewChat,
}) {
  return (
    <div
      className={`${className} w-full flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 md:w-1/3 md:min-w-64`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-gray-200 px-4 py-4 dark:border-gray-800 sm:px-5">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">
          Đoạn chat
        </h2>

        <button
          type="button"
          onClick={onNewChat}
          className="shrink-0 cursor-pointer rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 sm:px-3.5 dark:hover:bg-indigo-500"
        >
          + Tin nhắn mới
        </button>
      </div>

      <div className="flex-1 divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800/60">
        {loading ? (
          <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Đang tải danh sách...
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Chưa có cuộc hội thoại nào
          </div>
        ) : (
          conversations.map((conversation) => {
            const isActive = activeConversation?.id === conversation.id;

            const displayName = getDisplayName(conversation);

            return (
              <button
                type="button"
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`flex w-full cursor-pointer items-center gap-3.5 px-5 py-3.5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                  isActive ? "bg-indigo-50/70 dark:bg-indigo-950/30" : ""
                }`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  {displayName?.charAt(0).toUpperCase() || "?"}
                </div>

                <div className="flex-1 overflow-hidden">
                  <h4 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                    {displayName}
                  </h4>

                  <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                    {conversation.type === "group"
                      ? `Nhóm · ${conversation.members?.length || 0} thành viên`
                      : "Nhấn để xem tin nhắn"}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ConversationList;
