import { useAuth } from "../../hooks/use-auth";
import { Card } from "../../components/ui/Card";

export function ProfilePage() {
  const { user } = useAuth();

  const initials =
    user?.name
      ?.split(" ")
      .map((name) => name[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "U";

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500">View your account information.</p>
      </div>

      <Card>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
            {initials}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.name}
            </h2>

            <p className="text-sm text-gray-500">{user?.email}</p>

            <span className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {user?.role}
            </span>
          </div>
        </div>
      </Card>
    </section>
  );
}
