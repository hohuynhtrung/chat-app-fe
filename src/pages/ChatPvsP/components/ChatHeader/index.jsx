function ChatHeader({ conversation, getDisplayName, onBack }) {
  if (!conversation) return null;

  const displayName = getDisplayName(conversation);

  return (
    <div className="flex items-center border-b border-gray-200 bg-white px-4 py-3 shadow-sm sm:px-6 sm:py-4 dark:border-gray-800 dark:bg-gray-900">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mr-3 rounded-lg px-2 py-1 text-sm font-medium text-indigo-600 hover:bg-indigo-50 md:hidden dark:text-indigo-400 dark:hover:bg-indigo-950/50"
        >
          ← Đoạn chat
        </button>
      )}

      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
          {displayName?.charAt(0).toUpperCase() || "?"}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-gray-900 dark:text-white">
            {displayName}
          </h3>
          {conversation.type === "group" && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {conversation.members?.length || 0} thành viên
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
