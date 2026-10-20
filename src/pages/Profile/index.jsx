import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faCalendarAlt,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import Header from "@/layouts/DefaultLayout/components/Header";
import Footer from "@/layouts/DefaultLayout/components/Footer";
import {
  useCurrentUser,
  useFetchCurrentUser,
  useAuthFetching,
} from "@/features/auth/hook";

function Profile() {
  const navigate = useNavigate();

  useFetchCurrentUser();

  const currentUser = useCurrentUser();
  const fetching = useAuthFetching();

  if (fetching && !currentUser) {
    return (
      <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Đang tải thông tin hồ sơ...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Phiên đăng nhập hết hạn
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 cursor-pointer"
          >
            Đăng nhập ngay
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <Header />

      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
            <div className="h-36 bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-600 sm:h-44"></div>

            <div className="px-6 pb-8 pt-0">
              <div className="relative -mt-16 flex items-end justify-between sm:-mt-20">
                <div className="flex items-end gap-4">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-indigo-600 text-3xl font-bold text-white shadow-lg sm:h-32 sm:w-32 dark:border-gray-900">
                    {currentUser.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentUser.username}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Thành viên chính thức của Chat App
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3.5 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800/80 dark:bg-gray-800/50">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Địa chỉ Email
                    </p>
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {currentUser.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800/80 dark:bg-gray-800/50">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                    <FontAwesomeIcon icon={faIdCard} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Mã định danh (User ID)
                    </p>
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white font-mono">
                      {currentUser.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800/80 dark:bg-gray-800/50 sm:col-span-2">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Ngày tham gia hệ thống
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {currentUser.createdAt
                        ? new Date(currentUser.createdAt).toLocaleDateString(
                            "vi-VN",
                          )
                        : "Cập nhật gần đây"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-100 pt-6 dark:border-gray-800">
                <button
                  onClick={() => navigate("/chat")}
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 cursor-pointer dark:bg-indigo-600 dark:hover:bg-indigo-500"
                >
                  Đến phòng nhắn tin
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Profile;
