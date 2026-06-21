import { api } from "./axios";
import type { Book, BookFilters, PaginatedResponse } from "../types/book";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface CreateBookData {
  title: string;
  author: string;
  category?: string;
  isbn?: string;
  coverUrl?: string;
  quantity: number;
}

export type UpdateBookData = Partial<CreateBookData>;

export async function getBooks(filters: BookFilters = {}) {
  const response = await api.get<PaginatedResponse<Book>>("/books", {
    params: filters,
  });

  return response.data;
}

export async function CreateBook(data: CreateBookData): Promise<Book> {
  const response = await api.post<ApiResponse<Book>>("/books", data);

  return response.data.data;
}

export async function updateBook(
  id: number,
  data: UpdateBookData,
): Promise<Book> {
  const response = await api.put<ApiResponse<Book>>(`/books/${id}`, data);

  return response.data.data;
}

export async function deleteBook(id: number): Promise<void> {
  await api.delete(`/books/${id}`);
}
