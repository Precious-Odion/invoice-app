import { Button } from "../../components/common/Button/Button";
import { EmptyState } from "../../components/common/EmptyState/EmptyState";
import { FilterDropdown } from "../../components/invoice/FilterDropdown/FilterDropdown";
import { InvoiceCard } from "../../components/invoice/InvoiceCard/InvoiceCard";
import { AppShell } from "../../components/layout/AppShell/AppShell";
import { seedInvoices } from "../../data/seedInvoices";
import "./InvoiceListPage.css";

export function InvoiceListPage() {
  const invoices = seedInvoices;
  const hasInvoices = invoices.length > 0;

  return (
    <AppShell>
      <section className="invoice-list-page page-container">
        <header className="invoice-list-page__header">
          <div>
            <h1 className="invoice-list-page__title">Invoices</h1>
            <p className="invoice-list-page__subtitle">
              {hasInvoices
                ? `There are ${invoices.length} total invoices`
                : "No invoices"}
            </p>
          </div>

          <div className="invoice-list-page__actions">
            <FilterDropdown />

            <Button variant="primary" icon="+">
              New Invoice
            </Button>
          </div>
        </header>

        {hasInvoices ? (
          <section
            className="invoice-list-page__list"
            aria-label="Invoice list"
          >
            {invoices.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </section>
        ) : (
          <EmptyState />
        )}
      </section>
    </AppShell>
  );
}
