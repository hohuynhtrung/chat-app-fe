import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ROUTES } from "@/config/routes.const";
import { login } from "@/service/auth/authService";
import { useAppDispatch, useAuth } from "@/features/auth/hook";

function Login() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAuth();

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));

    if (login.fulfilled.match(result)) {
      console.log("Đăng nhập thành công:", result.payload);
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-xl transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900">
        <div className="text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white shadow-md">
            💬
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Đăng nhập vào Chat App
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Chào mừng bạn quay trở lại!
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-3.5 text-sm font-medium text-red-600 dark:bg-red-950/50 dark:text-red-400">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Mật khẩu
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 pr-14 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 sm:text-sm"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-9 text-xs font-semibold text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </button>
          </div>

          <div className="flex items-center justify-center pt-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Bạn chưa có tài khoản?</span>
            <Link
              to={ROUTES.REGISTER}
              className="ml-1.5 font-semibold text-indigo-600 transition-colors hover:underline dark:text-indigo-400"
            >
              Đăng ký ngay
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-500"
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
