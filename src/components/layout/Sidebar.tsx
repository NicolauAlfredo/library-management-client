import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";

interface SidebarProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ mobile = false, onNavigate }: SidebarProps) {
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";

  const links = [
    ...(isAdmin ? [{ to: "/dashboard", label: "Dashboard" }] : []),
    { to: "/books", label: "Books" },
    ...(isAdmin ? [{ to: "/users", label: "Users" }] : []),
    ...(isAdmin
      ? [{ to: "/loans", label: "Loans" }]
      : [{ to: "/my-loans", label: "My Loans" }]),
  ];

  return (
    <aside
      className={
        mobile
          ? "h-full w-64 bg-white px-4 py-6"
          : "fixed inset-y-0 left-0 hidden w-64 border-r border-gray-200 bg-white px-4 py-6 lg:block"
      }
    >
      <h1 className="mb-8 text-xl font-bold text-gray-900">Library Admin</h1>

      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-sm font-medium ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
