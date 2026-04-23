export type InvoiceStatus = "draft" | "pending" | "paid";

export type InvoiceCurrency = "GBP" | "USD" | "EUR" | "NGN" | "CAD";

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

export interface Invoice {
  id: string;
  createdAt: string;
  paymentDue: string;
  description: string;
  paymentTerms: number;
  clientName: string;
  clientEmail: string;
  status: InvoiceStatus;
  currency: InvoiceCurrency;
  senderAddress: Address;
  clientAddress: Address;
  items: InvoiceItem[];
  total: number;
}

export interface InvoiceFormValues {
  createdAt: string;
  description: string;
  paymentTerms: number;
  clientName: string;
  clientEmail: string;
  status: InvoiceStatus;
  currency: InvoiceCurrency;
  senderAddress: Address;
  clientAddress: Address;
  items: InvoiceItem[];
}