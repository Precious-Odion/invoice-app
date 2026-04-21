import type { ReactNode } from "react";
import { InvoiceProvider } from "../context/InvoiceContext";
import { ThemeProvider } from "../context/ThemeContext";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <InvoiceProvider>{children}</InvoiceProvider>
    </ThemeProvider>
  );
}
