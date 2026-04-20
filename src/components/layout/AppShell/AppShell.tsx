import type { ReactNode } from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import { TopBar } from "../TopBar/TopBar";
import "./AppShell.css";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <Sidebar />
      <TopBar />
      <main className="app-shell__content">{children}</main>
    </div>
  );
}
