import { Outlet } from "react-router-dom";
import ThemeToggle from "@/components/ThemeLayout/ThemeToggle";

function DefaultLayout() {
  return (
    <div className="relative min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <div className="fixed top-4 right-4 z-9999">
        <ThemeToggle />
      </div>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default DefaultLayout;
