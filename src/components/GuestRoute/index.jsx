import { useCurrentUser, useFetchCurrentUser } from "@/features/auth/hook";
import { Navigate, Outlet } from "react-router-dom";

function GuestRoute() {
  const currentUser = useCurrentUser();
  const fetching = useFetchCurrentUser();

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default GuestRoute;
