import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { seedInvoices } from "../data/seedInvoices";
import type { Invoice, InvoiceStatus } from "../types/invoice";

type InvoiceFilter = "all" | InvoiceStatus;

interface CreateInvoiceInput extends Omit<
  Invoice,
  "id" | "total" | "paymentDue"
> {
  id?: string;
}

interface InvoiceContextValue {
  invoices: Invoice[];
  filter: InvoiceFilter;
  filteredInvoices: Invoice[];
  setFilter: (filter: InvoiceFilter) => void;
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
    const savedInvoices = localStorage.getItem(INVOICES_STORAGE_KEY);

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

  const [filter, setFilter] = useState<InvoiceFilter>("all");

  useEffect(() => {
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices));
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    if (filter === "all") {
      return invoices;
    }

    return invoices.filter((invoice) => invoice.status === filter);
  }, [filter, invoices]);

  const getInvoiceById = (id: string) => {
    return invoices.find((invoice) => invoice.id === id);
  };

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
      filter,
      filteredInvoices,
      setFilter,
      getInvoiceById,
      createInvoice,
      updateInvoice,
      deleteInvoice,
      markAsPaid,
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
