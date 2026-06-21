import type { User } from "./user";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
