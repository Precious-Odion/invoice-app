import { AppShell } from "../../components/layout/AppShell/AppShell";
import { InvoiceFormDrawer } from "../../components/invoice/InvoiceFormDrawer/InvoiceFormDrawer";

export function EditInvoicePage() {
  return (
    <AppShell>
      <InvoiceFormDrawer mode="edit" />
    </AppShell>
  );
}
