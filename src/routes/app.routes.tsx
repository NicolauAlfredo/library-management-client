import { createBrowserRouter } from "react-router-dom";

import { ProtectedRoute } from "../components/protected-route/ProtectedRoute";

import { LoginPage } from "../pages/login/LoginPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { BooksPage } from "../pages/books/BooksPage";
import { UsersPage } from "../pages/users/UsersPage";
import { LoansPage } from "../pages/loans/LoansPage";
import path from "path";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
      {
        path: "/books",
        element: <BooksPage />,
      },
      {
        path: "/users",
        element: <UsersPage />,
      },
      {
        path: "/loans",
        element: <LoansPage />,
      },
    ],
  },
]);
