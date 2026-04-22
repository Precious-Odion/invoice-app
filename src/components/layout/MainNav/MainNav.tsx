import { useTheme } from "../../../context/ThemeContext";
import "./MainNav.css";

export function MainNav() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <nav className="main-nav">
      <div className="main-nav__logo">
        <div className="main-nav__logo-top" />
        <div className="main-nav__logo-bottom" />
        <div className="main-nav__logo-mark" />
      </div>

      <div className="main-nav__right">
        <button
          className="main-nav__theme"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          type="button"
        >
          <span
            className={`main-nav__theme-icon ${
              isDark
                ? "main-nav__theme-icon--light"
                : "main-nav__theme-icon--dark"
            }`}
            aria-hidden="true"
          />
        </button>

        <div className="main-nav__divider" />

        <img
          className="main-nav__avatar"
          src="https://i.pravatar.cc/40?img=12"
          alt="User avatar"
        />
      </div>
    </nav>
  );
}
