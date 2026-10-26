function NewChatModal({
  open,
  userId,
  onUserIdChange,
  onSubmit,
  onClose,
  creating,
  error,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-6 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
          Nhắn tin mới
        </h3>

        <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          Nhập mã định danh (User ID) của người bạn muốn trò chuyện.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <input
              id="new-chat-user-id"
              type="text"
              required
              value={userId}
              onChange={(e) => onUserIdChange(e.target.value)}
              placeholder="Nhập User ID..."
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "new-chat-user-id-error" : undefined}
              className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500"
                  : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-gray-700"
              }`}
            />
            {error && (
              <p
                id="new-chat-user-id-error"
                role="alert"
                className="mt-2 text-sm text-red-600 dark:text-red-400"
              >
                {error}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={creating || !userId.trim()}
              className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto dark:hover:bg-indigo-500"
            >
              {creating ? "Đang tạo..." : "Tạo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewChatModal;
