import { getCurrentUser } from "@/service/auth/authService";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export const useAuth = () => {
  return useSelector((state) => state.auth);
};

export const useFetchCurrentUser = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token && !currentUser) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, currentUser]);
};

export const useCurrentUser = () => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  return currentUser;
};

export const useAuthFetching = () => {
  const fetching = useSelector((state) => state.auth.fetching);
  return fetching;
};
