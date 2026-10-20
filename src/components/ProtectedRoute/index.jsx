import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/hook";
import { ROUTES } from "@/config/routes.const";

function ProtectedRoute() {
  const { isAuthenticated, accessToken } = useAuth();
  const hasToken = accessToken || localStorage.getItem("accessToken");

  if (!hasToken && !isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
