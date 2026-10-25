import ThemeToggle from "@/components/ThemeLayout/ThemeToggle";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="relative min-h-screen bg-linear-to-br from-indigo-50/50 via-white to-gray-50 text-gray-900 transition-colors duration-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 dark:text-gray-100">
      <div className="fixed top-2.75 right-4 z-50">
        <ThemeToggle />
      </div>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AuthLayout;
