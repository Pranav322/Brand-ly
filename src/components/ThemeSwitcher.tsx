import { useTheme } from "../contexts/ThemeContext";
import { Moon, Sun, Monitor } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="w-5 h-5" />;
      case "dark":
        return <Moon className="w-5 h-5" />;
      case "system":
        return <Monitor className="w-5 h-5" />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case "light":
        return "Switch to dark theme";
      case "dark":
        return "Switch to system theme";
      case "system":
        return "Switch to light theme";
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-lg bg-light-surface dark:bg-dark-surface 
                border border-light-border dark:border-dark-border
                text-light-text-secondary dark:text-dark-text-secondary
                hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={getLabel()}
    >
      {getIcon()}
    </button>
  );
}
