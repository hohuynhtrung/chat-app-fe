import { Link } from "react-router-dom";
import { ROUTES } from "@/config/routes.const";
import ThemeToggle from "@/components/ThemeLayout/ThemeToggle";

function Header() {
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
          <Link className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Users
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            hohuynhtrung2003@gmail.com
          </span>
          <button className="text-sm text-[#0084FF] hover:underline cursor-pointer">
            Đăng xuất
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
export default Header;
