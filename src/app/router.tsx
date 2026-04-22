import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { ProtectedRoute } from "../components/common/ProtectedRoute/ProtectedRoute";
import { InvoiceDetailPage } from "../pages/InvoiceDetailPage/InvoiceDetailPage";
import { InvoiceListPage } from "../pages/InvoiceListPage/InvoiceListPage";
import { LoginPage } from "../pages/LoginPage/LoginPage";
import { SignupPage } from "../pages/SignupPage/SignupPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        element: <ProtectedRoute />,
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
    ],
  },
]);
