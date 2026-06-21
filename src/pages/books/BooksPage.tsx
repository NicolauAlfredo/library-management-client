import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { ApiErrorResponse } from "../../types/api";

import {
  createBook,
  deleteBook,
  getBooks,
  updateBook,
} from "../../api/books.api";

import { BookForm } from "./components/BookForm";

import type { Book } from "../../types/book";
import type { BookFormData } from "./book.schema";

export function BooksPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [available, setAvailable] = useState("");
  const [limit, setLimit] = useState(10);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const queryClient = useQueryClient();

  const createBookMutation = useMutation({
    mutationFn: createBook,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setErrorMessage("");
      setIsFormOpen(false);
    },

    onError: (error) => {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        setErrorMessage(
          error.response?.data.message ?? "Failed to create book",
        );

        return;
      }

      setErrorMessage("Unexpected error");
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
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        setErrorMessage(
          error.response?.data.message ?? "Failed to update book",
        );

        return;
      }

      setErrorMessage("Unexpected error");
    },
  });

  const deleteBookMutation = useMutation({
    mutationFn: deleteBook,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setErrorMessage("");
    },

    onError: (error) => {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        setErrorMessage(
          error.response?.data.message ?? "Failed to delete book",
        );

        return;
      }

      setErrorMessage("Unexpected error");
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
    return <p>Loading books...</p>;
  }

  if (isError) {
    return <p>Failed to load books.</p>;
  }

  return (
    <section>
      <button
        type="button"
        onClick={() => {
          setSelectedBook(null);
          setIsFormOpen((current) => !current);
        }}
      >
        {isFormOpen ? "Close Form" : "Add Book"}
      </button>

      {errorMessage && <p>{errorMessage}</p>}

      {isFormOpen && (
        <BookForm
          defaultValues={selectedBook ?? undefined}
          isSubmitting={
            createBookMutation.isPending || updateBookMutation.isPending
          }
          onSubmit={handleSubmitBook}
        />
      )}

      <h1>Books</h1>

      <div>
        <input
          type="text"
          placeholder="Search by title, author or ISBN"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setPage(1);
          }}
        />

        <select
          value={available}
          onChange={(event) => {
            setAvailable(event.target.value);
            setPage(1);
          }}
        >
          <option value="">All availability</option>
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>

        <select
          value={limit}
          onChange={(event) => {
            setLimit(Number(event.target.value));
            setPage(1);
          }}
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
        </select>
      </div>

      <div>
        {data?.data.map((book) => (
          <article key={book.id}>
            {book.coverUrl && (
              <img src={book.coverUrl} alt={book.title} width={80} />
            )}

            <h2>{book.title}</h2>
            <p>{book.author}</p>
            <p>{book.category}</p>
            <p>
              Available: {book.availableQuantity}/{book.quantity}
            </p>

            <button
              type="button"
              onClick={() => {
                setSelectedBook(book);
                setIsFormOpen(true);
              }}
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => deleteBookMutation.mutate(book.id)}
            >
              Delete
            </button>
          </article>
        ))}
      </div>

      <div>
        <button
          type="button"
          disabled={page === 1}
          onClick={() => setPage((currentPage) => currentPage - 1)}
        >
          Previous
        </button>

        <span>
          Page {data?.pagination.page} of {data?.pagination.totalPages}
        </span>

        <button
          type="button"
          disabled={
            !data?.pagination.totalPages || page === data.pagination.totalPages
          }
          onClick={() => setPage((currentPage) => currentPage + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}
