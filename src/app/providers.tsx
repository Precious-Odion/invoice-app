import type { ReactNode } from "react";
import { AuthProvider } from "../context/AuthContext";
import { InvoiceProvider } from "../context/InvoiceContext";
import { ThemeProvider } from "../context/ThemeContext";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InvoiceProvider>{children}</InvoiceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
