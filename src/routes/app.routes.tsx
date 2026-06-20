import { createBrowserRouter } from "react-router-dom";

import { LoginPage } from "../pages/login/LoginPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { BooksPage } from "../pages/books/BooksPage";
import { UsersPage } from "../pages/users/UsersPage";
import { LoansPage } from "../pages/loans/LoansPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
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
]);
