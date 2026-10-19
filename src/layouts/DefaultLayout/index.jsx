import Header from "@/layouts/DefaultLayout/components/Header";
import { Outlet } from "react-router-dom";

import ThemeToggle from "@/components/ThemeLayout/ThemeToggle";

function DefaultLayout() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute bottom-2.5 right-2.5">
        <ThemeToggle />
      </div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
export default DefaultLayout;
