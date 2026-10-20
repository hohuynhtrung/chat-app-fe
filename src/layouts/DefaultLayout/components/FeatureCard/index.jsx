import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

function FeatureCard({ to, icon, title, description, iconClass }) {
  return (
    <Link
      to={to}
      className="group flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-700"
    >
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${iconClass}`}
      >
        <FontAwesomeIcon icon={icon} />
      </span>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>

      <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
        Mở ngay
        <FontAwesomeIcon
          icon={faArrowRight}
          className="transition-transform group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}

export default FeatureCard;
