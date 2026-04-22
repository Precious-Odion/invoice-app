import type { ReactNode } from "react";
import { MainNav } from "../MainNav/MainNav";
import "./AppShell.css";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <MainNav />
      <main className="app-shell__content">{children}</main>
    </div>
  );
}
