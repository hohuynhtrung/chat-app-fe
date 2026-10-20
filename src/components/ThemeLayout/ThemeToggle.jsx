import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "./ThemeContext";

function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={darkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white/80 text-gray-700 shadow-sm backdrop-blur-md transition-all hover:bg-gray-100 hover:scale-105 dark:border-gray-800 dark:bg-gray-900/80 dark:text-gray-300 dark:hover:bg-gray-800"
    >
      <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="text-sm" />
    </button>
  );
}

export default ThemeToggle;
