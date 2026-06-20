import { api } from "./axios";

import type { AuthResponse, LoginRequest } from "../types/auth";
import type { User } from "../types/user";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function loginResquest(data: LoginRequest): Promise<AuthResponse> {
  const response = await api.post<ApiResponse<AuthResponse>>(
    " /auth/login",
    data,
  );

  return response.data.data;
}

export async function getProfieRequest(): Promise<User> {
  const response = await api.get<ApiResponse<User>>("/auth/profile");

  return response.data.data;
}
