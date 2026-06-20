import { api } from "./axios";
import type { DashboardStats } from "../types/dashboard";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function getAdminDashboardStats(): Promise<DashboardStats> {
  const response =
    await api.get<ApiResponse<DashboardStats>>("/dashboard/admin");

  return response.data.data;
}
