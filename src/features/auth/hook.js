import { useDispatch, useSelector } from "react-redux";

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Hook tiện ích riêng cho Auth
export const useAuth = () => {
  return useSelector((state) => state.auth);
};
