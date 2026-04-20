import { AppShell } from "../../components/layout/AppShell/AppShell";
import { InvoiceFormDrawer } from "../../components/invoice/InvoiceFormDrawer/InvoiceFormDrawer";

export function NewInvoicePage() {
  return (
    <AppShell>
      <InvoiceFormDrawer mode="new" />
    </AppShell>
  );
}
