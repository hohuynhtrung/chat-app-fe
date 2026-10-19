import ThemeToggle from "@/components/ThemeLayout/ThemeToggle";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute bottom-2.5 right-2.5">
        <ThemeToggle />
      </div>
      <main className="flex min-h-[calc(100vh-65px)] items-center justify-center p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default AuthLayout;
