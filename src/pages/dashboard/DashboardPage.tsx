import { useQuery } from "@tanstack/react-query";
import { getAdminDashboardStats } from "../../api/dashboard.api";

export function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getAdminDashboardStats,
  });

  if (isLoading) {
    return <p>Loading dashboard...</p>;
  }

  if (isError) {
    return <p>Failed to load dashboard.</p>;
  }

  return (
    <section>
      <h1>Dashboard</h1>

      <div>
        <article>
          <h2>Total Users</h2>
          <p>{data?.totalUsers}</p>
        </article>

        <article>
          <h2>Total Books</h2>
          <p>{data?.totalBooks}</p>
        </article>

        <article>
          <h2>Available Books</h2>
          <p>{data?.totalAvailableBooks}</p>
        </article>

        <article>
          <h2>Active Loans</h2>
          <p>{data?.activeLoans}</p>
        </article>

        <article>
          <h2>Returned Loans</h2>
          <p>{data?.returnedLoans}</p>
        </article>

        <article>
          <h2>Late Loans</h2>
          <p>{data?.lateLoans}</p>
        </article>
      </div>
    </section>
  );
}
