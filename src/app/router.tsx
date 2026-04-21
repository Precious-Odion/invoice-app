import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { InvoiceDetailPage } from "../pages/InvoiceDetailPage/InvoiceDetailPage";
import { InvoiceListPage } from "../pages/InvoiceListPage/InvoiceListPage";

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
        element: <InvoiceListPage />,
      },
      {
        path: "invoice/:id",
        element: <InvoiceDetailPage />,
      },
      {
        path: "invoice/:id/edit",
        element: <InvoiceDetailPage />,
      },
    ],
  },
]);
