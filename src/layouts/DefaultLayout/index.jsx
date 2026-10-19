import Header from "@/layouts/DefaultLayout/components/Header";
import { Outlet } from "react-router-dom";

function DefaultLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}
export default DefaultLayout;
