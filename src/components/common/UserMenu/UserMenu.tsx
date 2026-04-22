import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { ProfileModal } from "../ProfileModal/ProfileModal";
import "./UserMenu.css";

export function UserMenu() {
  const { user, logout, updateAvatar } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "U";

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="user-menu" ref={wrapperRef}>
        <button
          type="button"
          className="user-menu__trigger"
          aria-label="Open user menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          {user?.avatar ? (
            <img
              className="user-menu__avatar"
              src={user.avatar}
              alt={user.name}
            />
          ) : (
            <span className="user-menu__initials">{initials}</span>
          )}
        </button>

        {isOpen ? (
          <div className="user-menu__dropdown">
            <div className="user-menu__info">
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>

            <button
              type="button"
              className="user-menu__item"
              onClick={() => fileInputRef.current?.click()}
            >
              Change profile picture
            </button>

            <button
              type="button"
              className="user-menu__item"
              onClick={() => {
                setIsOpen(false);
                setIsProfileOpen(true);
              }}
            >
              Profile
            </button>

            <button
              type="button"
              className="user-menu__item user-menu__item--danger"
              onClick={() => {
                logout();
                setIsOpen(false);
                navigate("/login");
              }}
            >
              Logout
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarUpload}
            />
          </div>
        ) : null}
      </div>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}
