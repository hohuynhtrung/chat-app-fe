import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
const formatTime = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const markdownComponents = {
  h1: ({ children }) => (
    <h1 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2 text-base font-semibold text-gray-900 dark:text-gray-100">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-2 last:mb-0 whitespace-pre-wrap wrap-break-word">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-blue-600 underline underline-offset-2 dark:text-blue-400"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-gray-300 pl-3 text-gray-600 dark:border-gray-600 dark:text-gray-300">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-3 border-gray-200 dark:border-gray-700" />,
  pre: ({ children }) => (
    <pre className="my-3 overflow-x-auto rounded-xl bg-gray-200 p-4 text-left text-gray-100 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-black">
      {children}
    </pre>
  ),
  code: ({ children, className }) => {
    return (
      <code
        className={`rounded bg-gray-200/70 px-1 py-0.5 font-mono text-[0.9em] dark:bg-gray-700 ${
          className || ""
        }`}
      >
        {children}
      </code>
    );
  },
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto">
      <table className="min-w-full border-collapse text-left text-xs">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-gray-300 bg-gray-100 px-3 py-2 font-semibold dark:border-gray-700 dark:bg-gray-800">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-gray-300 px-3 py-2 dark:border-gray-700">
      {children}
    </td>
  ),
};

const ChatbotMessageItem = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full gap-2 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-[11px] font-semibold text-white dark:bg-gray-100 dark:text-gray-900">
          AI
        </div>
      )}

      <div
        className={`flex max-w-[85%] flex-col sm:max-w-[75%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-2xl px-3 py-2 text-[13px] leading-7 ${
            isUser
              ? "rounded-br-md bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
              : "rounded-bl-md border border-gray-100 bg-gray-50 text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap wrap-break-word">
              {message.content}
            </p>
          ) : (
            <div className="wrap-break-word">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        <div className="mt-1 flex items-center gap-2 px-1">
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            {formatTime(message.createdAt)}
          </span>

          {message.isTemporary && (
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              Đang gửi...
            </span>
          )}

          {message.failed && (
            <span className="text-[10px] text-red-500 dark:text-red-400">
              Gửi thất bại
            </span>
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-[11px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          Bạn
        </div>
      )}
    </div>
  );
};

export default ChatbotMessageItem;
