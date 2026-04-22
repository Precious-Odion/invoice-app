import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AuthPage.css";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const redirectPath =
    (location.state as { from?: string } | null)?.from ?? "/";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const result = login({ email, password });

    if (!result.success) {
      setError(result.message ?? "Unable to login.");
      return;
    }

    navigate(redirectPath, { replace: true });
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1 className="auth-card__title">Login</h1>
        <p className="auth-card__subtitle">
          Continue to your invoice dashboard
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
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
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error ? <p className="auth-form__error">{error}</p> : null}

          <button type="submit" className="auth-form__submit">
            Login
          </button>
        </form>

        <p className="auth-card__footer">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </section>
    </main>
  );
}
