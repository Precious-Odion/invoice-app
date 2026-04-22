import { useEffect, useRef, type ChangeEvent } from "react";
import { useAuth } from "../../../context/AuthContext";
import "./ProfileModal.css";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, updateAvatar } = useAuth();
  const dialogRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    dialogRef.current?.focus();
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleOverlayClick = () => {
    onClose();
  };

  const handleDialogClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
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
    <div
      className="profile-modal__overlay"
      onClick={handleOverlayClick}
      aria-hidden="true"
    >
      <div
        ref={dialogRef}
        className="profile-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        tabIndex={-1}
        onClick={handleDialogClick}
      >
        <div className="profile-modal__header">
          <h2 id="profile-modal-title" className="profile-modal__title">
            Profile
          </h2>

          <button
            type="button"
            className="profile-modal__close"
            onClick={onClose}
            aria-label="Close profile modal"
          >
            ×
          </button>
        </div>

        <div className="profile-modal__body">
          <div className="profile-modal__avatar-wrap">
            {user.avatar ? (
              <img
                className="profile-modal__avatar"
                src={user.avatar}
                alt={user.name}
              />
            ) : (
              <div className="profile-modal__initials">{initials}</div>
            )}

            <button
              type="button"
              className="profile-modal__upload"
              onClick={() => fileInputRef.current?.click()}
            >
              Change picture
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
          </div>

          <div className="profile-modal__details">
            <div className="profile-modal__field">
              <span className="profile-modal__label">Name</span>
              <strong className="profile-modal__value">{user.name}</strong>
            </div>

            <div className="profile-modal__field">
              <span className="profile-modal__label">Email</span>
              <strong className="profile-modal__value">{user.email}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
