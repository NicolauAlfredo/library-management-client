import { useQuery } from "@tanstack/react-query";

import { getAdminDashboardStats } from "../../api/dashboard.api";
import { Card } from "../../components/ui/Card";
import { Loading } from "../../components/ui/Loading";
import { ErrorMessage } from "../../components/ui/ErrorMessage";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getAdminDashboardStats,
  });

  const loanStatusData = [
    { name: "Active", value: data?.activeLoans ?? 0 },
    { name: "Returned", value: data?.returnedLoans ?? 0 },
    { name: "Late", value: data?.lateLoans ?? 0 },
  ];

  const booksData = [
    {
      name: "Available",
      value: data?.totalAvailableBooks ?? 0,
    },
    {
      name: "Borrowed",
      value: (data?.activeLoans ?? 0) + (data?.lateLoans ?? 0),
    },
  ];

  if (isLoading) {
    return <Loading message="Loading dashboard..." />;
  }

  if (isError) {
    return <ErrorMessage message="Failed to load dashboard." />;
  }

  const loanStatusColors = {
    Active: "#2563EB",
    Returned: "#22C55E",
    Late: "#EF4444",
  };

  const chartTooltipStyle = {
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "12px",
  };

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

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border border-gray-100 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Loan Distribution
          </h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={loanStatusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {loanStatusData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={
                        loanStatusColors[
                          entry.name as keyof typeof loanStatusColors
                        ]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip contentStyle={chartTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border border-gray-100 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Library Inventory
          </h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={booksData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />

                <Tooltip contentStyle={chartTooltipStyle} />

                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {booksData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.name === "Available" ? "#2563EB" : "#0F172A"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </section>
  );
}
