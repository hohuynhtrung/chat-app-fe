function NewChatModal({
  open,
  type,
  onTypeChange,
  userId,
  onUserIdChange,
  groupName,
  onGroupNameChange,
  groupMemberIds,
  onGroupMemberIdsChange,
  onSubmit,
  onClose,
  creating,
  error,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-6 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
          Tạo cuộc trò chuyện
        </h3>

        <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
          {[
            { value: "dm", label: "Tin nhắn riêng" },
            { value: "group", label: "Tạo nhóm" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onTypeChange(option.value)}
              aria-pressed={type === option.value}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                type === option.value
                  ? "bg-white text-indigo-700 shadow-sm dark:bg-gray-700 dark:text-indigo-300"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {type === "group" ? (
            <>
              <div>
                <label
                  htmlFor="new-group-name"
                  className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Tên nhóm
                </label>
                <input
                  id="new-group-name"
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => onGroupNameChange(e.target.value)}
                  placeholder="Nhập tên nhóm..."
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                />
              </div>
              <div>
                <label
                  htmlFor="new-group-members"
                  className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  User ID thành viên
                </label>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Nhập ID của ít nhất 2 người khác. Bạn sẽ tự động được thêm
                  vào nhóm.
                </p>
                <textarea
                  id="new-group-members"
                  required
                  rows={3}
                  value={groupMemberIds}
                  onChange={(e) => onGroupMemberIdsChange(e.target.value)}
                  placeholder={
                    "Nhập ít nhất 2 User ID, mỗi ID một dòng\nhoặc phân cách bằng dấu phẩy"
                  }
                  aria-invalid={Boolean(error)}
                  aria-describedby={
                    error ? "new-group-members-error" : undefined
                  }
                  className={`w-full resize-y rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 ${
                    error
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500"
                      : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-gray-700"
                  }`}
                />
              </div>
            </>
          ) : (
            <div>
              <label
                htmlFor="new-chat-user-id"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                User ID
              </label>
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
            </div>
          )}

          {error && (
            <p
              id={
                type === "group"
                  ? "new-group-members-error"
                  : "new-chat-user-id-error"
              }
              role="alert"
              className="text-sm text-red-600 dark:text-red-400"
            >
              {error}
            </p>
          )}

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
              disabled={
                creating ||
                (type === "dm"
                  ? !userId.trim()
                  : !groupName.trim() || !groupMemberIds.trim())
              }
              className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto dark:hover:bg-indigo-500"
            >
              {creating ? "Đang tạo..." : type === "group" ? "Tạo nhóm" : "Tạo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewChatModal;
