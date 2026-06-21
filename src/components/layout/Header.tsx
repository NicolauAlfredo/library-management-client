import { useAuth } from "../../hooks/use-auth";
import { Button } from "../ui/Button";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-blue-500 bg-blue-500 px-4 py-4 text-white sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-blue-100">Signed in as</p>
          <strong className="text-sm font-semibold text-white">
            {user?.name}
          </strong>
        </div>
        <Button variant="secondary" onClick={logout}>
          Logout
        </Button>{" "}
      </div>
    </header>
  );
}
