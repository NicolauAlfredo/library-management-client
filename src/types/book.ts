export interface Book {
  id: number;
  title: string;
  author: string;
  category: string | null;
  isbn: string | null;
  coverUrl: string | null;
  quantity: number;
  availableQuantity: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  available?: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
