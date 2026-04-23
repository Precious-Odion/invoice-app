import { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AuthPage.css";

export function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState("");

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const result = signup({
      name,
      email,
      password,
      avatar,
    });

    if (!result.success) {
      setError(result.message ?? "Unable to sign up.");
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1 className="auth-card__title">Create account</h1>
        <p className="auth-card__subtitle">Set up your invoice workspace</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-form__field">
            <span>Full name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

          <label className="auth-form__field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="auth-form__field">
            <span>Password</span>
            <div className="auth-form__password">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <button
                type="button"
                className="auth-form__toggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <svg width="18" height="18">
                    ...
                  </svg>
                ) : (
                  <svg width="18" height="18">
                    ...
                  </svg>
                )}
              </button>
            </div>
          </label>

          <label className="auth-form__field">
            <span>Profile picture</span>

            <div className="auth-form__upload-row">
              <label
                htmlFor="avatarUpload"
                className="auth-form__upload-button"
              >
                Choose picture
              </label>

              <span className="auth-form__upload-name">
                {avatar ? "Image selected" : "No file chosen"}
              </span>
            </div>

            <input
              id="avatarUpload"
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
          </label>

          {error ? <p className="auth-form__error">{error}</p> : null}

          <button type="submit" className="auth-form__submit">
            Sign up
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}
