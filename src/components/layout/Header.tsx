import { Menu } from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import { Button } from "../ui/Button";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-blue-700 bg-blue-600 px-4 py-4 text-white sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="lg:hidden">
            <Menu size={24} />
          </button>

          <div>
            <p className="text-sm text-blue-100">Signed in as</p>

            <strong className="text-sm font-semibold text-white">
              {user?.name}
            </strong>
          </div>
        </div>

        <Button onClick={logout}>Logout</Button>
      </div>
    </header>
  );
}
