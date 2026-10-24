function ChatHeader({ conversation, getDisplayName }) {
  if (!conversation) return null;

  const displayName = getDisplayName(conversation);

  return (
    <div className="flex items-center border-b border-gray-200 bg-white px-6 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
          {displayName?.charAt(0).toUpperCase() || "?"}
        </div>

        <h3 className="text-sm font-bold text-gray-900 dark:text-white">
          {displayName}
        </h3>
      </div>
    </div>
  );
}

export default ChatHeader;
