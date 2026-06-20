import { api } from "./axios";
import type { Book, BookFilters, PaginatedResponse } from "../types/book";

export async function getBooks(filters: BookFilters = {}) {
  const response = await api.get<PaginatedResponse<Book>>("/books", {
    params: filters,
  });

  return response.data;
}
