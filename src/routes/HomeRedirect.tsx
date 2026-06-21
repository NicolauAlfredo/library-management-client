import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

export function HomeRedirect() {
  const { user } = useAuth();

  if (user?.role === "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/books" replace />;
}
