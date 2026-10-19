import { Route, Routes } from "react-router-dom";

import AuthLayout from "@/layouts/AuthLayout";
import DefaultLayout from "@/layouts/DefaultLayout";
import Login from "@/pages/Auth/Login";
import ChatPvsP from "@/pages/ChatPvsP";
import Register from "@/pages/Auth/Register";
import { ROUTES } from "@/config/routes.const";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route index element={<ChatPvsP />} />
        <Route path={ROUTES.CHAT} element={<ChatPvsP />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
