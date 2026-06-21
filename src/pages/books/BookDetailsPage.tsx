import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getBookById } from "../../api/books.api";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { Loading } from "../../components/ui/Loading";

export function BookDetailsPage() {
  const { id } = useParams();

  const bookId = Number(id);

  const {
    data: book,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["book", bookId],
    queryFn: () => getBookById(bookId),
    enabled: Number.isInteger(bookId) && bookId > 0,
  });

  if (isLoading) {
    return <Loading message="Loading book details..." />;
  }

  if (isError || !book) {
    return <ErrorMessage message="Failed to load book details." />;
  }

  return (
    <section className="space-y-6">
      <div>
        <Link to="/books">
          <Button type="button" variant="secondary">
            Back to books
          </Button>
        </Link>
      </div>

      <Card>
        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
          {book.coverUrl && (
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-full max-w-56 rounded-lg object-cover"
            />
          )}

          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>

              <p className="text-lg text-gray-500">{book.author}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <strong className="text-gray-900">
                  {book.category ?? "No category"}
                </strong>
              </div>

              <div>
                <p className="text-sm text-gray-500">ISBN</p>
                <strong className="text-gray-900">
                  {book.isbn ?? "No ISBN"}
                </strong>
              </div>

              <div>
                <p className="text-sm text-gray-500">Quantity</p>
                <strong className="text-gray-900">{book.quantity}</strong>
              </div>

              <div>
                <p className="text-sm text-gray-500">Available</p>
                <strong className="text-gray-900">
                  {book.availableQuantity}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
