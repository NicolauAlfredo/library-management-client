import { api } from "./axios";

import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth";
import type { User } from "../types/user";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function loginRequest(data: LoginRequest): Promise<AuthResponse> {
  const response = await api.post<ApiResponse<AuthResponse>>(
    "/auth/login",
    data,
  );

  return response.data.data;
}

export async function registerRequest(
  data: RegisterRequest,
): Promise<AuthResponse> {
  const response = await api.post<ApiResponse<AuthResponse>>(
    "/auth/register",
    data,
  );

  return response.data.data;
}

export async function updateProfileRequest(data: {
  name?: string;
  email?: string;
}): Promise<User> {
  const response = await api.patch<ApiResponse<User>>("/auth/profile", data);

  return response.data.data;
}

export async function getProfileRequest(): Promise<User> {
  const response = await api.get<ApiResponse<User>>("/auth/profile");

  return response.data.data;
}
