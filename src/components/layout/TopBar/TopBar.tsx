import { useTheme } from "../../../context/ThemeContext";
import "./TopBar.css";

export function TopBar() {
  const { theme, toggleTheme } = useTheme();

  const themeIcon = theme === "dark" ? "☀" : "☾";
  const themeLabel =
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <div className="topbar">
      <button
        className="topbar__theme-button"
        aria-label={themeLabel}
        type="button"
        onClick={toggleTheme}
      >
        <span className="topbar__theme-icon" aria-hidden="true">
          {themeIcon}
        </span>
      </button>

      <div className="topbar__divider" />

      <button className="topbar__avatar-button" aria-label="User profile">
        <img
          className="topbar__avatar"
          src="https://i.pravatar.cc/40?img=12"
          alt="User avatar"
        />
      </button>
    </div>
  );
}
