import { createBrowserRouter } from "react-router-dom";

import { ProtectedRoute } from "../components/protected-route/ProtectedRoute";

import { LoginPage } from "../pages/login/LoginPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { BooksPage } from "../pages/books/BooksPage";
import { UsersPage } from "../pages/users/UsersPage";
import { LoansPage } from "../pages/loans/LoansPage";
import { AppLayout } from "../components/layout/AppLayout";
import { HomeRedirect } from "./HomeRedirect";
import { AdminRoute } from "../components/protected-route/AdminRoute";
import { MyLoansPage } from "../pages/my-loans/MyLoansPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/",
            element: <HomeRedirect />,
          },
          {
            path: "/dashboard",
            element: (
              <AdminRoute>
                <DashboardPage />
              </AdminRoute>
            ),
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
            element: (
              <AdminRoute>
                <LoansPage />
              </AdminRoute>
            ),
          },
          {
            path: "/my-loans",
            element: <MyLoansPage />,
          },
        ],
      },
    ],
  },
]);
