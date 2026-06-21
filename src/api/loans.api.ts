import { api } from "./axios";
import type { Loan, LoanFilters } from "../types/loan";
import type { PaginatedResponse } from "../types/book";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function getLoans(filters: LoanFilters = {}) {
  const response = await api.get<PaginatedResponse<Loan>>("/loans", {
    params: filters,
  });

  return response.data;
}

export async function getMyLoans(): Promise<PaginatedResponse<Loan>> {
  const response = await api.get<ApiResponse<Loan[]>>("/loans/my");

  return {
    success: response.data.success,
    data: response.data.data,
    pagination: {
      page: 1,
      limit: response.data.data.length,
      total: response.data.data.length,
      totalPages: 1,
    },
  };
}

export async function borrowBook(bookId: number): Promise<Loan> {
  const response = await api.post<ApiResponse<Loan>>(`/loans/borrow/${bookId}`);

  return response.data.data;
}

export async function returnBook(loanId: number): Promise<Loan> {
  const response = await api.patch<ApiResponse<Loan>>(
    `/loans/${loanId}/return`,
  );

  return response.data.data;
}

export async function updateOverdueLoans(): Promise<{ updatedLoans: number }> {
  const response = await api.patch<ApiResponse<{ updatedLoans: number }>>(
    "/loans/update-overdue",
  );

  return response.data.data;
}
