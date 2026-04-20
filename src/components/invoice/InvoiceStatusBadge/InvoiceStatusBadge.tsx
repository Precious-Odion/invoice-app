import type { InvoiceStatus } from "../../../types/invoice";
import "./InvoiceStatusBadge.css";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
}

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  return (
    <span className={`invoice-status-badge invoice-status-badge--${status}`}>
      <span className="invoice-status-badge__dot" />
      <span className="invoice-status-badge__label">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </span>
  );
}
