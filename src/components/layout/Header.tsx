import { useAuth } from "../../hooks/use-auth";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header>
      <div>
        <strong>{user?.name}</strong>
      </div>

      <button onClick={logout}>Logout</button>
    </header>
  );
}
