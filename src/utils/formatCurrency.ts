import type { InvoiceCurrency } from "../types/invoice";

export function formatCurrency(
  amount: number,
  currency: InvoiceCurrency = "GBP",
): string {
  const localeMap: Record<InvoiceCurrency, string> = {
    GBP: "en-GB",
    USD: "en-US",
    EUR: "en-IE",
    NGN: "en-NG",
    CAD: "en-CA",
  };

  return new Intl.NumberFormat(localeMap[currency], {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}