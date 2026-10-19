import { useFetchCurrentUser } from "@/features/auth/hook";

function AuthProvider({ children }) {
  useFetchCurrentUser();

  return children;
}

export default AuthProvider;
