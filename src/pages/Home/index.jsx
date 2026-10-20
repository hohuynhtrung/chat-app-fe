import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faRobot, faUser } from "@fortawesome/free-solid-svg-icons";

import { ROUTES } from "@/config/routes.const";
import { useCurrentUser } from "@/features/auth/hook";
import Header from "@/layouts/DefaultLayout/components/Header";
import Footer from "@/layouts/DefaultLayout/components/Footer";
import FeatureCard from "@/layouts/DefaultLayout/components/FeatureCard";

function Home() {
  const currentUser = useCurrentUser();

  const features = [
    {
      to: currentUser ? ROUTES.PROFILE(currentUser.username) : ROUTES.LOGIN,
      icon: faUser,
      title: "Hồ sơ",
      description: "Xem và quản lý thông tin tài khoản của bạn.",
      iconClass: "bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-300",
    },
    {
      to: ROUTES.CHAT,
      icon: faComments,
      title: "Chat PvsP",
      description:
        "Nhắn tin trực tiếp với người dùng khác, tin nhắn đến ngay theo thời gian thực.",
      iconClass:
        "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300",
    },
    {
      to: ROUTES.CHATBOT,
      icon: faRobot,
      title: "Chat Bot",
      description: "Trò chuyện với trợ lý AI để hỏi đáp và nhờ hỗ trợ.",
      iconClass:
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <Header />

      <main className="flex-1">
        <section className="bg-linear-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950">
          <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:py-24">
            <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
              Chat realtime · Chat Bot
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
              Xin chào{currentUser?.username ? `, ${currentUser.username}` : ""}
              !
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base text-gray-600 dark:text-gray-400">
              Nhắn tin trực tiếp với mọi người theo thời gian thực, hoặc trò
              chuyện với trợ lý AI, tất cả trong một nơi.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to={ROUTES.CHAT}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
              >
                Bắt đầu nhắn tin
              </Link>
              <Link
                to={ROUTES.CHATBOT}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <FontAwesomeIcon icon={faRobot} />
                Trò chuyện với Chat Bot
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-20">
          <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
            Bạn muốn làm gì hôm nay?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
