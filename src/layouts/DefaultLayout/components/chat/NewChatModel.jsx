function NewChatModal({
  open,
  userId,
  onUserIdChange,
  onSubmit,
  onClose,
  creating,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
          Nhắn tin mới
        </h3>

        <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          Nhập mã định danh (User ID) của người bạn muốn trò chuyện.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            required
            value={userId}
            onChange={(e) => onUserIdChange(e.target.value)}
            placeholder="Nhập User ID..."
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={creating || !userId.trim()}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-indigo-500"
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
