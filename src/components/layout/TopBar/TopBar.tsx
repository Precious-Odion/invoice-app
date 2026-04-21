import { useTheme } from "../../../context/ThemeContext";
import "./TopBar.css";

export function TopBar() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <div className="topbar">
      <button
        className="topbar__theme-button"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        type="button"
        onClick={toggleTheme}
      >
        <span
          className={`topbar__theme-icon ${
            isDark ? "topbar__theme-icon--light" : "topbar__theme-icon--dark"
          }`}
          aria-hidden="true"
        />
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
