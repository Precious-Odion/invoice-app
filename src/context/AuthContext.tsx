/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface AuthUser {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  signup: (payload: AuthUser) => { success: boolean; message?: string };
  login: (payload: { email: string; password: string }) => {
    success: boolean;
    message?: string;
  };
  logout: () => void;
  updateAvatar: (avatar: string) => void;
}

const AUTH_USERS_KEY = "invoice-app-auth-users";
const AUTH_SESSION_KEY = "invoice-app-auth-session";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;

    const session = window.localStorage.getItem(AUTH_SESSION_KEY);
    if (!session) return null;

    try {
      return JSON.parse(session) as AuthUser;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (user) {
      window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(AUTH_SESSION_KEY);
    }
  }, [user]);

  const signup = (payload: AuthUser) => {
    if (typeof window === "undefined") {
      return { success: false, message: "Signup unavailable" };
    }

    const normalizedEmail = payload.email.trim().toLowerCase();

    const existingRaw = window.localStorage.getItem(AUTH_USERS_KEY);
    const existingUsers = existingRaw
      ? (JSON.parse(existingRaw) as AuthUser[])
      : [];

    const emailExists = existingUsers.some(
      (user) => user.email.trim().toLowerCase() === normalizedEmail,
    );

    if (emailExists) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    const newUser: AuthUser = {
      ...payload,
      email: normalizedEmail,
    };

    const updatedUsers = [...existingUsers, newUser];

    window.localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(updatedUsers));
    setUser(newUser);

    return { success: true };
  };

  const login = (payload: { email: string; password: string }) => {
    if (typeof window === "undefined") {
      return { success: false, message: "Login unavailable" };
    }

    const existingRaw = window.localStorage.getItem(AUTH_USERS_KEY);

    if (!existingRaw) {
      return {
        success: false,
        message: "No account found. Please sign up first.",
      };
    }

    const existingUsers = JSON.parse(existingRaw) as AuthUser[];
    const normalizedEmail = payload.email.trim().toLowerCase();

    const matchedUser = existingUsers.find(
      (user) => user.email.trim().toLowerCase() === normalizedEmail,
    );

    if (!matchedUser) {
      return { success: false, message: "Email not found." };
    }

    if (matchedUser.password !== payload.password) {
      return { success: false, message: "Incorrect password." };
    }

    setUser(matchedUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const updateAvatar = (avatar: string) => {
    if (!user || typeof window === "undefined") return;

    const updatedUser = { ...user, avatar };
    setUser(updatedUser);
    window.localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(updatedUser));
  };

  const value = useMemo(
    () => ({
      user,
      signup,
      login,
      logout,
      updateAvatar,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
