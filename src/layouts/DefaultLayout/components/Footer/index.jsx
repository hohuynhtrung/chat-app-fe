import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-8 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <p className="text-sm">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            Chat App
          </span>
          . All rights reserved.
        </p>

        <div className="flex items-center gap-6 text-sm">
          <Link
            to="/"
            className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Trang chủ
          </Link>
          <Link
            to="/chat"
            className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Phòng chat
          </Link>
          <Link
            to="/chatbot"
            className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Chat Bot
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
