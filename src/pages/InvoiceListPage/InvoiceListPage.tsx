import { AppShell } from "../../components/layout/AppShell/AppShell";
import "./InvoiceListPage.css";

export function InvoiceListPage() {
  const hasInvoices = false;

  return (
    <AppShell>
      <section className="invoice-list-page page-container">
        <header className="invoice-list-page__header">
          <div>
            <h1 className="invoice-list-page__title">Invoices</h1>
            <p className="invoice-list-page__subtitle">
              {hasInvoices ? "There are 7 total invoices" : "No invoices"}
            </p>
          </div>

          <div className="invoice-list-page__actions">
            <button className="invoice-list-page__filter-button" type="button">
              Filter by status
              <span className="invoice-list-page__filter-arrow">⌄</span>
            </button>

            <button className="invoice-list-page__new-button" type="button">
              <span className="invoice-list-page__new-button-icon">+</span>
              <span>New Invoice</span>
            </button>
          </div>
        </header>

        {!hasInvoices && (
          <section className="invoice-list-page__empty-state">
            <div className="invoice-list-page__illustration" aria-hidden="true">
              <div className="invoice-list-page__illustration-envelope" />
              <div className="invoice-list-page__illustration-person" />
            </div>

            <h2 className="invoice-list-page__empty-title">
              There is nothing here
            </h2>

            <p className="invoice-list-page__empty-text">
              Create a new invoice by clicking the
              <br />
              <strong>New Invoice</strong> button and get started
            </p>
          </section>
        )}
      </section>
    </AppShell>
  );
}
