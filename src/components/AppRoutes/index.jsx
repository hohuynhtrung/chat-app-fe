import { Route, Routes } from "react-router-dom";

import { useCurrentUser } from "@/features/auth/hook";
import AuthLayout from "@/layouts/AuthLayout";
import DefaultLayout from "@/layouts/DefaultLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Auth/Login";
import ChatPvsP from "@/pages/ChatPvsP";
import Register from "@/pages/Auth/Register";
import { ROUTES } from "@/config/routes.const";
import GuestRoute from "@/components/GuestRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import Profile from "@/pages/Profile";

function AppRoutes() {
  const currentUser = useCurrentUser();
  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route index element={<Home />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<DefaultLayout />}>
          <Route path={ROUTES.CHAT} element={<ChatPvsP />} />
          <Route
            path={
              currentUser?.username
                ? ROUTES.PROFILE(currentUser.username)
                : "/profile/:username"
            }
            element={<Profile />}
          />
        </Route>
      </Route>

      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
