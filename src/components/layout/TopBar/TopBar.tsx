import "./TopBar.css";

export function TopBar() {
  return (
    <div className="topbar">
      <button className="topbar__theme-button" aria-label="Toggle theme">
        <span className="topbar__theme-icon" />
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
