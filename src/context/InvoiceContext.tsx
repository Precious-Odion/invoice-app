/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { seedInvoices } from "../data/seedInvoices";
import type { Invoice, InvoiceStatus } from "../types/invoice";

type InvoiceFilter = InvoiceStatus;

interface CreateInvoiceInput extends Omit<
  Invoice,
  "id" | "total" | "paymentDue"
> {
  id?: string;
}

interface InvoiceContextValue {
  invoices: Invoice[];
  selectedFilters: InvoiceFilter[];
  filteredInvoices: Invoice[];
  toggleFilter: (filter: InvoiceFilter) => void;
  clearFilters: () => void;
  getInvoiceById: (id: string) => Invoice | undefined;
  createInvoice: (invoice: CreateInvoiceInput) => Invoice;
  updateInvoice: (
    id: string,
    updates: Omit<Invoice, "id" | "total" | "paymentDue">,
  ) => void;
  deleteInvoice: (id: string) => void;
  markAsPaid: (id: string) => void;
}

const InvoiceContext = createContext<InvoiceContextValue | undefined>(
  undefined,
);

const INVOICES_STORAGE_KEY = "invoice-app-invoices";

interface InvoiceProviderProps {
  children: ReactNode;
}

function calculateInvoiceTotal(items: Invoice["items"]) {
  return items.reduce((sum, item) => sum + item.total, 0);
}

function calculatePaymentDue(createdAt: string, paymentTerms: number) {
  const date = new Date(createdAt);
  date.setDate(date.getDate() + paymentTerms);
  return date.toISOString().split("T")[0];
}

function generateInvoiceId() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  const randomLetters =
    letters[Math.floor(Math.random() * letters.length)] +
    letters[Math.floor(Math.random() * letters.length)];

  const randomNumbers =
    numbers[Math.floor(Math.random() * numbers.length)] +
    numbers[Math.floor(Math.random() * numbers.length)] +
    numbers[Math.floor(Math.random() * numbers.length)] +
    numbers[Math.floor(Math.random() * numbers.length)];

  return `${randomLetters}${randomNumbers}`;
}

export function InvoiceProvider({ children }: InvoiceProviderProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    if (typeof window === "undefined") {
      return seedInvoices;
    }

    const savedInvoices = window.localStorage.getItem(INVOICES_STORAGE_KEY);

    if (!savedInvoices) {
      return seedInvoices;
    }

    try {
      const parsedInvoices = JSON.parse(savedInvoices) as Invoice[];
      return parsedInvoices.length > 0 ? parsedInvoices : seedInvoices;
    } catch {
      return seedInvoices;
    }
  });

  const [selectedFilters, setSelectedFilters] = useState<InvoiceFilter[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices));
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    if (selectedFilters.length === 0) {
      return invoices;
    }

    return invoices.filter((invoice) =>
      selectedFilters.includes(invoice.status),
    );
  }, [invoices, selectedFilters]);

  const toggleFilter = (filter: InvoiceFilter) => {
    setSelectedFilters((currentFilters) =>
      currentFilters.includes(filter)
        ? currentFilters.filter((item) => item !== filter)
        : [...currentFilters, filter],
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  const getInvoiceById = useCallback(
    (id: string) => {
      return invoices.find((invoice) => invoice.id === id);
    },
    [invoices],
  );

  const createInvoice = (invoiceInput: CreateInvoiceInput) => {
    const items = invoiceInput.items.map((item) => ({
      ...item,
      total: item.quantity * item.price,
    }));

    const createdInvoice: Invoice = {
      ...invoiceInput,
      id: invoiceInput.id ?? generateInvoiceId(),
      items,
      total: calculateInvoiceTotal(items),
      paymentDue: calculatePaymentDue(
        invoiceInput.createdAt,
        invoiceInput.paymentTerms,
      ),
    };

    setInvoices((currentInvoices) => [createdInvoice, ...currentInvoices]);

    return createdInvoice;
  };

  const updateInvoice = (
    id: string,
    updates: Omit<Invoice, "id" | "total" | "paymentDue">,
  ) => {
    setInvoices((currentInvoices) =>
      currentInvoices.map((invoice) => {
        if (invoice.id !== id) {
          return invoice;
        }

        const items = updates.items.map((item) => ({
          ...item,
          total: item.quantity * item.price,
        }));

        return {
          ...invoice,
          ...updates,
          items,
          total: calculateInvoiceTotal(items),
          paymentDue: calculatePaymentDue(
            updates.createdAt,
            updates.paymentTerms,
          ),
        };
      }),
    );
  };

  const deleteInvoice = (id: string) => {
    setInvoices((currentInvoices) =>
      currentInvoices.filter((invoice) => invoice.id !== id),
    );
  };

  const markAsPaid = (id: string) => {
    setInvoices((currentInvoices) =>
      currentInvoices.map((invoice) =>
        invoice.id === id ? { ...invoice, status: "paid" } : invoice,
      ),
    );
  };

  const value = useMemo(
    () => ({
      invoices,
      selectedFilters,
      filteredInvoices,
      toggleFilter,
      clearFilters,
      getInvoiceById,
      createInvoice,
      updateInvoice,
      deleteInvoice,
      markAsPaid,
    }),
    [invoices, selectedFilters, filteredInvoices, getInvoiceById],
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
