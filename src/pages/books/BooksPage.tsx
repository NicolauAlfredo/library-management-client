import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getApiErrorMessage } from "../../utils/get-api-error-message";
import { borrowBook } from "../../api/loans.api";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { Input } from "../../components/ui/Input";
import { Loading } from "../../components/ui/Loading";
import { Select } from "../../components/ui/Select";

import {
  createBook,
  deleteBook,
  getBooks,
  updateBook,
} from "../../api/books.api";

import { BookForm } from "./components/BookForm";

import type { Book } from "../../types/book";
import type { BookFormData } from "./book.schema";
import { ConfirmModal } from "../../components/ui/ConfirmModal";

export function BooksPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [available, setAvailable] = useState("");
  const [limit, setLimit] = useState(10);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  const queryClient = useQueryClient();

  const createBookMutation = useMutation({
    mutationFn: createBook,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setErrorMessage("");
      setIsFormOpen(false);
    },

    onError: (error) => {
      setErrorMessage(getApiErrorMessage(error, "Failed to create book"));
    },
  });

  const updateBookMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: BookFormData }) =>
      updateBook(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setErrorMessage("");
      setSelectedBook(null);
      setIsFormOpen(false);
    },

    onError: (error) => {
      setErrorMessage(getApiErrorMessage(error, "Failed to update book"));
    },
  });

  const deleteBookMutation = useMutation({
    mutationFn: deleteBook,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setErrorMessage("");
    },

    onError: (error) => {
      setErrorMessage(getApiErrorMessage(error, "Failed to delete book"));
    },
  });

  const borrowBookMutation = useMutation({
    mutationFn: borrowBook,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setErrorMessage("");
    },

    onError: (error) => {
      setErrorMessage(getApiErrorMessage(error, "Failed to borrow book"));
    },
  });

  function handleSubmitBook(data: BookFormData) {
    if (selectedBook) {
      updateBookMutation.mutate({
        id: selectedBook.id,
        data,
      });

      return;
    }

    createBookMutation.mutate(data);
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["books", page, search, category, available, limit],
    queryFn: () =>
      getBooks({
        page,
        limit,
        search: search || undefined,
        category: category || undefined,
        available:
          available === "true"
            ? true
            : available == "false"
              ? false
              : undefined,
      }),
  });

  if (isLoading) {
    return <Loading message="Loading books..." />;
  }

  if (isError) {
    return <ErrorMessage message="Failed to load books." />;
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Books</h1>
          <p className="text-sm text-gray-500">
            Manage books, availability and library catalog.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => {
            setSelectedBook(null);
            setIsFormOpen((current) => !current);
            setErrorMessage("");
          }}
        >
          {isFormOpen ? "Close Form" : "Add Book"}
        </Button>
      </div>

      {errorMessage && <ErrorMessage message={errorMessage} />}

      <Card>
        <div className="grid gap-4 md:grid-cols-4">
          <Input
            placeholder="Search by title, author or ISBN"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
          <Input
            placeholder="Category"
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setPage(1);
            }}
          />
          <Select
            value={available}
            onChange={(event) => {
              setAvailable(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All availability</option>
            <option value="true">Available</option>
            <option value="false">Unavailabley</option>
          </Select>

          <Select
            value={limit}
            onChange={(event) => {
              setLimit(Number(event.target.value));
              setPage(1);
            }}
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </Select>
        </div>
      </Card>

      {isFormOpen && (
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {selectedBook ? "Update Book" : "Create Book"}
          </h2>

          <BookForm
            defaultValues={selectedBook ?? undefined}
            isSubmitting={
              createBookMutation.isPending || updateBookMutation.isPending
            }
            onSubmit={handleSubmitBook}
          />
        </Card>
      )}

      {!data?.data.length ? (
        <EmptyState message="No books found." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.data.map((book) => (
            <Card key={book.id}>
              <div className="flex gap-4">
                {book.coverUrl && (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="h-28 w-20 rounded-md object-cover"
                  />
                )}

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-lg font-semibold text-gray-900">
                    {book.title}
                  </h2>

                  <p className="text-sm text-gray-500">{book.author}</p>

                  <p className="mt-2 text-sm text-gray-600">
                    {book.category ?? "No category"}
                  </p>

                  <p className="mt-2 text-sm font-medium text-gray-900">
                    Available: {book.availableQuantity} / {book.quantity}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setSelectedBook(book);
                    setIsFormOpen(true);
                    setErrorMessage("");
                  }}
                >
                  Edit
                </Button>

                <Button
                  type="button"
                  variant="danger"
                  onClick={() => setBookToDelete(book)}
                  disabled={deleteBookMutation.isPending}
                >
                  Delete
                </Button>

                <Button
                  type="button"
                  disabled={
                    book.availableQuantity === 0 || borrowBookMutation.isPending
                  }
                  onClick={() => borrowBookMutation.mutate(book.id)}
                >
                  {book.availableQuantity === 0 ? "Unavailable" : "Borrow"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="secondary"
            disabled={page === 1}
            onClick={() => setPage((currentPage) => currentPage - 1)}
          >
            Previous
          </Button>

          <span className="text-sm text-gray-600">
            Page {data?.pagination.page} of {data?.pagination.totalPages}
          </span>

          <Button
            type="button"
            variant="secondary"
            disabled={
              !data?.pagination.totalPages ||
              page === data.pagination.totalPages
            }
            onClick={() => setPage((currentPage) => currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </Card>

      <ConfirmModal
        isOpen={!!bookToDelete}
        title="Delete book"
        message={`Are you sure you want to delete "${bookToDelete?.title}"?`}
        confirmLabel="Delete"
        isLoading={deleteBookMutation.isPending}
        onCancel={() => setBookToDelete(null)}
        onConfirm={() => {
          if (bookToDelete) {
            deleteBookMutation.mutate(bookToDelete.id, {
              onSuccess: () => setBookToDelete(null),
            });
          }
        }}
      />
    </section>
  );
}
