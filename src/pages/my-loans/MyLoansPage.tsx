import { useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { getMyLoans, returnBook } from "../../api/loans.api";
import { getApiErrorMessage } from "../../utils/get-api-error-message";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { Input } from "../../components/ui/Input";
import { Loading } from "../../components/ui/Loading";
import { Select } from "../../components/ui/Select";

import type { Loan, LoanStatus } from "../../types/loan";

import toast from "react-hot-toast";

export function MyLoansPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<LoanStatus | "">("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loanToReturn, setLoanToReturn] = useState<Loan | null>(null);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["my-loans", page, search, status],
    queryFn: () =>
      getMyLoans({
        page,
        limit: 10,
        search: search || undefined,
        status: status || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const returnLoanMutation = useMutation({
    mutationFn: returnBook,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-loans"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });

      toast.success("Book returned successfully");

      setErrorMessage("");
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to return book"));
    },
  });

  if (isLoading && !data) {
    return <Loading message="Loading your loans..." />;
  }

  if (isError) {
    return <ErrorMessage message="Failed to load your loans." />;
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Loans</h1>

        <p className="text-sm text-gray-500">
          View and manage your borrowed books.
        </p>
      </div>

      {errorMessage && <ErrorMessage message={errorMessage} />}

      <Card>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            placeholder="Search by book title"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />

          <Select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as LoanStatus | "");
              setPage(1);
            }}
          >
            <option value="">All status</option>
            <option value="ACTIVE">Active</option>
            <option value="RETURNED">Returned</option>
            <option value="LATE">Late</option>
          </Select>
        </div>
      </Card>

      {isFetching && (
        <p className="text-sm text-gray-500">Updating results...</p>
      )}

      {!data?.data.length ? (
        <EmptyState message="You have no loans." />
      ) : (
        <div className="space-y-4">
          {data.data.map((loan) => (
            <Card key={loan.id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {loan.bookTitle}
                  </h2>

                  {loan.bookAuthor && (
                    <p className="text-sm text-gray-500">{loan.bookAuthor}</p>
                  )}

                  <p className="text-sm text-gray-500">
                    Due date: {new Date(loan.dueDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {loan.status}
                  </span>

                  {loan.status !== "RETURNED" && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setLoanToReturn(loan)}
                    >
                      Return Book
                    </Button>
                  )}
                </div>
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
            onClick={() => setPage((current) => current - 1)}
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
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      </Card>

      <ConfirmModal
        isOpen={!!loanToReturn}
        title="Return book"
        message={`Are you sure you want to return "${loanToReturn?.bookTitle}"?`}
        confirmLabel="Return"
        isLoading={returnLoanMutation.isPending}
        onCancel={() => setLoanToReturn(null)}
        onConfirm={() => {
          if (!loanToReturn) return;

          returnLoanMutation.mutate(loanToReturn.id, {
            onSuccess: () => {
              setLoanToReturn(null);
            },
          });
        }}
      />
    </section>
  );
}
