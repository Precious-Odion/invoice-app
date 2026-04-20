import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { EditInvoicePage } from "../pages/EditInvoicePage/EditInvoicePage";
import { InvoiceDetailPage } from "../pages/InvoiceDetailPage/InvoiceDetailPage";
import { InvoiceListPage } from "../pages/InvoiceListPage/InvoiceListPage";
import { NewInvoicePage } from "../pages/NewInvoicePage/NewInvoicePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <InvoiceListPage />,
      },
      {
        path: "invoice/new",
        element: <NewInvoicePage />,
      },
      {
        path: "invoice/:id",
        element: <InvoiceDetailPage />,
      },
      {
        path: "invoice/:id/edit",
        element: <EditInvoicePage />,
      },
    ],
  },
]);
