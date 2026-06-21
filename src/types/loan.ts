export type LoanStatus = "ACTIVE" | "RETURNED" | "LATE";

export interface Loan {
  id: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  bookId: number;
  bookTitle?: string;
  bookAuthor?: string;
  loanDate: string;
  dueDate: string;
  returnedAt: string | null;
  status: LoanStatus;
}

export interface LoanFilters {
  page?: number;
  limit?: number;
  status?: LoanStatus;
  userId?: number;
  bookId?: number;
  search?: string;
}
