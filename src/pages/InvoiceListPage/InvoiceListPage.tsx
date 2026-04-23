import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button/Button";
import { EmptyState } from "../../components/common/EmptyState/EmptyState";
import { InvoiceFormDrawer } from "../../components/invoice/InvoiceFormDrawer/InvoiceFormDrawer";
import { FilterDropdown } from "../../components/invoice/FilterDropdown/FilterDropdown";
import { InvoiceCard } from "../../components/invoice/InvoiceCard/InvoiceCard";
import { AppShell } from "../../components/layout/AppShell/AppShell";
import { useInvoices } from "../../context/InvoiceContext";
import "./InvoiceListPage.css";

export function InvoiceListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { filteredInvoices, selectedFilters } = useInvoices();

  const isNewInvoiceRoute = location.pathname === "/invoice/new";
  const hasInvoices = filteredInvoices.length > 0;

  const subtitle =
    selectedFilters.length === 0
      ? `There are ${filteredInvoices.length} total invoices`
      : `There are ${filteredInvoices.length} filtered invoices`;

  return (
    <>
      <AppShell>
        <section className="invoice-list-page page-container">
          <header className="invoice-list-page__header">
            <div>
              <h1 className="invoice-list-page__title">Invoices</h1>
              <p className="invoice-list-page__subtitle">
                {hasInvoices ? subtitle : "No invoices"}
              </p>
            </div>

            <div className="invoice-list-page__actions">
              <FilterDropdown />

              <Button
                variant="primary"
                icon={
                  <svg viewBox="0 0 10 10" aria-hidden="true">
                    <path
                      d="M5 1v8M1 5h8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                }
                onClick={() => navigate("/invoice/new")}
              >
                New Invoice
              </Button>
            </div>
          </header>

          {hasInvoices ? (
            <section
              className="invoice-list-page__list"
              aria-label="Invoice list"
            >
              {filteredInvoices.map((invoice) => (
                <InvoiceCard key={invoice.id} invoice={invoice} />
              ))}
            </section>
          ) : (
            <EmptyState />
          )}
        </section>
      </AppShell>

      {isNewInvoiceRoute ? <InvoiceFormDrawer mode="new" /> : null}
    </>
  );
}
