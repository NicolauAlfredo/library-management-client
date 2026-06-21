import { api } from "./axios";

import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth";

import type { User } from "../types/user";
import type { ForgotPasswordFormData } from "../pages/forgot-password/forgot-password.schema";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
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

export async function changePasswordRequest(
  data: ChangePasswordData,
): Promise<void> {
  await api.patch("/auth/change-password", data);
}

export async function getProfileRequest(): Promise<User> {
  const response = await api.get<ApiResponse<User>>("/auth/profile");

  return response.data.data;
}

export interface ForgotPasswordResponse {
  resetUrl: string | null;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface ForgotPasswordResponse {
  resetUrl: string | null;
}

export interface ForgotPasswordResponse {
  resetUrl: string | null;
}

export async function forgotPasswordRequest(
  data: ForgotPasswordFormData,
): Promise<void> {
  await api.post("/auth/forgot-password", data);
}

export async function resetPasswordRequest(
  data: ResetPasswordData,
): Promise<void> {
  await api.post("/auth/reset-password", data);
}
