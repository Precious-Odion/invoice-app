import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { seedInvoices } from "../data/seedInvoices";
import type { Invoice, InvoiceStatus } from "../types/invoice";

type InvoiceFilter = "all" | InvoiceStatus;

interface InvoiceContextValue {
  invoices: Invoice[];
  filter: InvoiceFilter;
  filteredInvoices: Invoice[];
  setFilter: (filter: InvoiceFilter) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
}

const InvoiceContext = createContext<InvoiceContextValue | undefined>(
  undefined,
);

interface InvoiceProviderProps {
  children: ReactNode;
}

export function InvoiceProvider({ children }: InvoiceProviderProps) {
  const [invoices] = useState<Invoice[]>(seedInvoices);
  const [filter, setFilter] = useState<InvoiceFilter>("all");

  const filteredInvoices = useMemo(() => {
    if (filter === "all") {
      return invoices;
    }

    return invoices.filter((invoice) => invoice.status === filter);
  }, [filter, invoices]);

  const getInvoiceById = (id: string) => {
    return invoices.find((invoice) => invoice.id === id);
  };

  const value = useMemo(
    () => ({
      invoices,
      filter,
      filteredInvoices,
      setFilter,
      getInvoiceById,
    }),
    [invoices, filter, filteredInvoices],
  );

  return (
    <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>
  );
}

export function useInvoices() {
  const context = useContext(InvoiceContext);

  if (!context) {
    throw new Error("useInvoices must be used within an InvoiceProvider");
  }

  return context;
}
