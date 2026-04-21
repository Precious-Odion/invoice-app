import { useTheme } from "../../../context/ThemeContext";
import "./TopBar.css";

export function TopBar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="topbar">
      <button
        className="topbar__theme-button"
        aria-label="Toggle theme"
        type="button"
        onClick={toggleTheme}
      >
        <span
          className={`topbar__theme-icon topbar__theme-icon--${theme}`}
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
