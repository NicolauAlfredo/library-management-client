export type Role = "ADMIN" | "USER";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: Role;
}