import { Link } from "react-router-dom";
import type { Invoice } from "../../../types/invoice";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate } from "../../../utils/formatDate";
import { InvoiceStatusBadge } from "../InvoiceStatusBadge/InvoiceStatusBadge";
import "./InvoiceCard.css";

interface InvoiceCardProps {
  invoice: Invoice;
}

export function InvoiceCard({ invoice }: InvoiceCardProps) {
  return (
    <Link to={`/invoice/${invoice.id}`} className="invoice-card">
      <div className="invoice-card__group invoice-card__group--left">
        <p className="invoice-card__id">
          <span className="invoice-card__hash">#</span>
          {invoice.id}
        </p>

        <p className="invoice-card__due-date">
          <span>Due </span>
          {formatDate(invoice.paymentDue)}
        </p>

        <p className="invoice-card__client-name">{invoice.clientName}</p>
      </div>

      <div className="invoice-card__group invoice-card__group--right">
        <p className="invoice-card__amount">{formatCurrency(invoice.total)}</p>
        <InvoiceStatusBadge status={invoice.status} />
        <span className="invoice-card__arrow" aria-hidden="true">
          ›
        </span>
      </div>
    </Link>
  );
}
