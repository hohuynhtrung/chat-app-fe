function MessageInput({ value, onChange, onSubmit, sending }) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-2 border-t border-gray-200 bg-white px-3 py-3 shadow-lg sm:gap-3 sm:px-6 sm:py-4 dark:border-gray-800 dark:bg-gray-900"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={sending}
        placeholder="Nhập tin nhắn..."
        className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 sm:px-4 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
      />

      <button
        type="submit"
        disabled={sending || !value.trim()}
        className="shrink-0 cursor-pointer rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 dark:hover:bg-indigo-500"
      >
        {sending ? "Đang gửi..." : "Gửi"}
      </button>
    </form>
  );
}

export default MessageInput;
