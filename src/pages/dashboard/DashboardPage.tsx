import { useQuery } from "@tanstack/react-query";

import { getAdminDashboardStats } from "../../api/dashboard.api";
import { Card } from "../../components/ui/Card";
import { Loading } from "../../components/ui/Loading";
import { ErrorMessage } from "../../components/ui/ErrorMessage";

export function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getAdminDashboardStats,
  });

  if (isLoading) {
    return <Loading message="Loading dashboard..." />;
  }

  if (isError) {
    return <ErrorMessage message="Failed to load dashboard." />;
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Overview of your library management system.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <p className="text-sm text-gray-500">Total Users</p>
          <strong className="text-3xl font-bold text-gray-900">
            {data?.totalUsers}
          </strong>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Total Books</p>
          <strong className="text-3xl font-bold text-gray-900">
            {data?.totalBooks}
          </strong>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Available Books</p>
          <strong className="text-3xl font-bold text-gray-900">
            {data?.totalAvailableBooks}
          </strong>
        </Card>

        <Card>
          <p className="text-sm text-gray-500"> Active Loans</p>
          <strong className="text-3xl font-bold text-gray-900">
            {data?.activeLoans}
          </strong>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Returned Loans</p>
          <strong className="text-3xl font-bold text-gray-900">
            {data?.returnedLoans}
          </strong>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Late Loans</p>
          <strong className="text-3xl font-bold text-red-600">
            {data?.lateLoans}
          </strong>
        </Card>
      </div>
    </section>
  );
}
