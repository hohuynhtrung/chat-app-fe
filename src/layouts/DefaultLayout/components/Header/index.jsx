import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";

import { ROUTES } from "@/config/routes.const";
import { useCurrentUser, useAppDispatch } from "@/features/auth/hook";
import { logout } from "@/service/auth/authService";

function Header() {
  const currentUser = useCurrentUser();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    if (!currentUser?.id) return;
    navigator.clipboard.writeText(currentUser.id);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md px-4 py-3.5 dark:border-gray-800 dark:bg-gray-900/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.CHAT}
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
              💬
            </span>
            <span>Chat App</span>
          </Link>

          {currentUser && (
            <div className="hidden items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 sm:inline-flex dark:bg-indigo-950 dark:text-indigo-400">
              <span>ID: {currentUser.id.slice(0, 6)}...</span>
              <button
                type="button"
                onClick={handleCopyId}
                title="Sao chép ID"
                className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded transition-colors hover:text-indigo-800 dark:hover:text-indigo-200 cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={copied ? faCheck : faCopy}
                  className={
                    copied ? "text-emerald-600 dark:text-emerald-400" : ""
                  }
                />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Xin chào,{" "}
                <strong className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {currentUser.username}
                </strong>
              </span>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-50 px-3.5 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400 dark:hover:bg-red-900/50"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to={ROUTES.LOGIN}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Đăng nhập
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
