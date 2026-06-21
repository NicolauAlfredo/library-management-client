import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/books" replace />;
  }

  return children;
}
