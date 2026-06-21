import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

import { useAuth } from "../../hooks/use-auth";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const initials =
    user?.name
      ?.split(" ")
      .map((name) => name[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-10 border-b border-blue-700 bg-blue-600 px-4 py-4 text-white sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <button onClick={onMenuClick} className="lg:hidden">
          <Menu size={24} />
        </button>

        <div className="ml-auto relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="flex items-center gap-3 rounded-full px-2 py-1 hover:bg-blue-700"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-blue-600">
              {initials}
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-xs text-blue-100">Signed in as</p>
              <strong className="text-sm font-semibold text-white">
                {user?.name}
              </strong>
            </div>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-lg border border-gray-200 bg-white py-2 text-gray-900 shadow-lg">
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>

              <Link
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                Profile
              </Link>

              <button
                type="button"
                onClick={logout}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
