import { Menu } from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import { Button } from "../ui/Button";
import { Link } from "react-router-dom";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();

  const initials =
    user?.name
      ?.split(" ")
      .map((name) => name[0])
      .splice(0, 2)
      .join("")
      .toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-10 border-b border-blue-700 bg-blue-600 px-4 py-4 text-white sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="lg:hidden">
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-blue-600">
              <Link to="/profile">{initials}</Link>
            </div>

            <div>
              <p className="text-sm text-blue-100">Signed in as</p>

              <strong className="text-sm font-semibold text-white">
                <Link to="/profile"> {user?.name}</Link>
              </strong>
            </div>
          </div>
        </div>

        <Button variant="secondary" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
