import { Link } from "react-router-dom";
import { ROUTES } from "@/config/routes.const";
import { useCurrentUser, useAppDispatch } from "@/features/auth/hook"; // Điều chỉnh path hook nếu cần
import { logout } from "@/service/auth/authService"; // Điều chỉnh path slice nếu cần

function Header() {
  const currentUser = useCurrentUser();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-800">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <div className="flex gap-4 items-center">
          <Link
            to={ROUTES.CHAT}
            className="text-lg font-semibold text-gray-900 dark:text-white"
          >
            Chat
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {currentUser ? (
            // TRƯỜNG HỢP ĐÃ ĐĂNG NHẬP: Hiện Username và Nút Đăng xuất
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Xin chào,{" "}
                <strong className="text-indigo-600 dark:text-indigo-400">
                  {currentUser.username}
                </strong>
              </span>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            // TRƯỜNG HỢP CHƯA ĐĂNG NHẬP: Hiện Đăng nhập / Đăng ký
            <div className="flex items-center gap-4">
              <Link
                to={ROUTES.LOGIN}
                className="text-sm text-[#0084FF] hover:underline cursor-pointer"
              >
                Đăng nhập
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="text-sm text-[#0084FF] hover:underline cursor-pointer"
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
