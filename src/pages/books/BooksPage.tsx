import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBooks } from "../../api/books.api";

export function BooksPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["books", page, search],
    queryFn: () =>
      getBooks({
        page,
        limit: 10,
        search: search || undefined,
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
      <h1>Books</h1>

      <input
        type="text"
        placeholder="Search by title, author or ISBN"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setPage(1);
        }}
      />

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
          disabled={page === data?.pagination.totalPages}
          onClick={() => setPage((currentPage) => currentPage + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}
