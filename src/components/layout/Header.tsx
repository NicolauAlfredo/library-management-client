import { useAuth } from "../../hooks/use-auth";
import { Button } from "../ui/Button";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Signed in as</p>{" "}
          <strong className="text-sm font-semibold text-gray-900">
            {user?.name}
          </strong>
        </div>
      </div>

      <Button variant="secondary" onClick={logout}>
        Logout
      </Button>
    </header>
  );
}
