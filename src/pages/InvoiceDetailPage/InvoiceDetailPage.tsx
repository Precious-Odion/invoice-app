import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/common/Button/Button";
import { Modal } from "../../components/common/Modal/Modal";
import { InvoiceFormDrawer } from "../../components/invoice/InvoiceFormDrawer/InvoiceFormDrawer";
import { InvoiceStatusBadge } from "../../components/invoice/InvoiceStatusBadge/InvoiceStatusBadge";
import { AppShell } from "../../components/layout/AppShell/AppShell";
import { useInvoices } from "../../context/InvoiceContext";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import "./InvoiceDetailPage.css";

export function InvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getInvoiceById, deleteInvoice, markAsPaid } = useInvoices();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const invoice = id ? getInvoiceById(id) : undefined;
  const isEditRoute = location.pathname.endsWith("/edit");

  if (!invoice) {
    return (
      <AppShell>
        <section className="invoice-detail-page page-container">
          <Link to="/" className="invoice-detail-page__back-link">
            ‹ Go back
          </Link>

          <article className="invoice-detail-card">
            <h1 className="invoice-detail-card__id">Invoice not found</h1>
            <p className="invoice-detail-card__description">
              The invoice you are trying to view does not exist.
            </p>
          </article>
        </section>
      </AppShell>
    );
  }

  return (
    <>
      <AppShell>
        <section className="invoice-detail-page page-container">
          <Link to="/" className="invoice-detail-page__back-link">
            ‹ Go back
          </Link>

          <div className="invoice-detail-page__status-bar">
            <div className="invoice-detail-page__status-left">
              <span className="invoice-detail-page__status-label">Status</span>
              <InvoiceStatusBadge status={invoice.status} />
            </div>

            <div className="invoice-detail-page__actions">
              <Link to={`/invoice/${invoice.id}/edit`}>
                <Button variant="secondary">Edit</Button>
              </Link>

              <Button
                variant="danger"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                Delete
              </Button>

              {invoice.status === "pending" ? (
                <Button
                  variant="primary"
                  onClick={() => markAsPaid(invoice.id)}
                >
                  Mark as Paid
                </Button>
              ) : null}
            </div>
          </div>

          <article className="invoice-detail-card">
            <header className="invoice-detail-card__header">
              <div>
                <h1 className="invoice-detail-card__id">
                  <span>#</span>
                  {invoice.id}
                </h1>
                <p className="invoice-detail-card__description">
                  {invoice.description}
                </p>
              </div>

              <address className="invoice-detail-card__address">
                <p>{invoice.senderAddress.street}</p>
                <p>{invoice.senderAddress.city}</p>
                <p>{invoice.senderAddress.postCode}</p>
                <p>{invoice.senderAddress.country}</p>
              </address>
            </header>

            <section className="invoice-detail-card__body">
              <div>
                <p className="invoice-detail-card__label">Invoice Date</p>
                <p className="invoice-detail-card__value">
                  {formatDate(invoice.createdAt)}
                </p>

                <p className="invoice-detail-card__label invoice-detail-card__label--spaced">
                  Payment Due
                </p>
                <p className="invoice-detail-card__value">
                  {formatDate(invoice.paymentDue)}
                </p>
              </div>

              <div>
                <p className="invoice-detail-card__label">Bill To</p>
                <p className="invoice-detail-card__value">
                  {invoice.clientName}
                </p>
                <address className="invoice-detail-card__sub-address">
                  <p>{invoice.clientAddress.street}</p>
                  <p>{invoice.clientAddress.city}</p>
                  <p>{invoice.clientAddress.postCode}</p>
                  <p>{invoice.clientAddress.country}</p>
                </address>
              </div>

              <div>
                <p className="invoice-detail-card__">Sent to</p>
                <p className="invoice-detail-card__value">
                  {invoice.clientEmail}
                </p>
              </div>
            </section>

            <section className="invoice-detail-card__items">
              <div className="invoice-detail-card__table-head">
                <span>Item Name</span>
                <span>QTY.</span>
                <span>Price</span>
                <span>Total</span>
              </div>

              {invoice.items.map((item) => (
                <div className="invoice-detail-card__table-row" key={item.id}>
                  <div className="invoice-detail-card__item-main">
                    <span className="invoice-detail-card__item-name">
                      {item.name}
                    </span>
                    <span className="invoice-detail-card__item-meta">
                      {item.quantity} x{" "}
                      {formatCurrency(item.price, invoice.currency)}
                    </span>
                  </div>

                  <span className="invoice-detail-card__item-total">
                    {formatCurrency(item.total, invoice.currency)}
                  </span>
                </div>
              ))}

              <div className="invoice-detail-card__total-row">
                <span>Amount Due</span>
                <strong>
                  {formatCurrency(invoice.total, invoice.currency)}
                </strong>
              </div>
            </section>
          </article>

          {isDeleteModalOpen ? (
            <Modal
              title="Confirm Deletion"
              onClose={() => setIsDeleteModalOpen(false)}
              actions={
                <>
                  <Button
                    variant="secondary"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      deleteInvoice(invoice.id);
                      setIsDeleteModalOpen(false);
                      navigate("/");
                    }}
                  >
                    Delete
                  </Button>
                </>
              }
            >
              Are you sure you want to delete invoice #{invoice.id}? This action
              cannot be undone.
            </Modal>
          ) : null}
        </section>
      </AppShell>

      {isEditRoute ? <InvoiceFormDrawer mode="edit" /> : null}
    </>
  );
}
