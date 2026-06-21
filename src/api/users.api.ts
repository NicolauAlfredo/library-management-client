import { api } from "./axios";
import type { PaginatedResponse } from "../types/book";
import type { UpdateUserData, User, UserFilters } from "../types/user";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function getUsers(filters: UserFilters = {}) {
  const response = await api.get<PaginatedResponse<User>>("/users", {
    params: filters,
  });

  return response.data;
}

export async function updateUser(
  id: number,
  data: UpdateUserData,
): Promise<User> {
  const response = await api.put<ApiResponse<User>>(`/users/${id}`, data);

  return response.data.data;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`);
}
