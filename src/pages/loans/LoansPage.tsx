import { useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getLoans,
  getMyLoans,
  returnBook,
  updateOverdueLoans,
} from "../../api/loans.api";
import { getApiErrorMessage } from "../../utils/get-api-error-message";

import type { Loan, LoanStatus } from "../../types/loan";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { Input } from "../../components/ui/Input";
import { Loading } from "../../components/ui/Loading";
import { Select } from "../../components/ui/Select";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { useAuth } from "../../contexts/auth.context";

export function LoansPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<LoanStatus | "">("");
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loanToReturn, setLoanToReturn] = useState<Loan | null>(null);

  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["loans", page, status, search, isAdmin],
    queryFn: () =>
      isAdmin
        ? getLoans({
            page,
            limit: 10,
            status: status || undefined,
            search: search || undefined,
          })
        : getMyLoans({
            page,
            limit: 10,
          }),
    placeholderData: keepPreviousData,
  });

  const returnLoanMutation = useMutation({
    mutationFn: returnBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setErrorMessage("");
    },
    onError: (error) => {
      setErrorMessage(getApiErrorMessage(error, "Failed to return book"));
    },
  });

  const updateOverdueMutation = useMutation({
    mutationFn: updateOverdueLoans,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setErrorMessage("");
    },
    onError: (error) => {
      setErrorMessage(
        getApiErrorMessage(error, "Failed to update overdue loans"),
      );
    },
  });

  if (isLoading && !data) {
    return <Loading message="Loading loans..." />;
  }

  if (isError) {
    return <Loading message="Failed to load loans." />;
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAdmin ? "Loans" : "My Loans"}
          </h1>

          <p className="text-sm text-gray-500">
            {isAdmin
              ? "Track active, returned and late book loans."
              : "View and manage your borrowed books."}
          </p>
        </div>

        {isAdmin && (
          <Button
            type="button"
            onClick={() => updateOverdueMutation.mutate()}
            disabled={updateOverdueMutation.isPending}
          >
            {updateOverdueMutation.isPending
              ? "Updating..."
              : "Update overdue loans"}
          </Button>
        )}
      </div>

      {errorMessage && <ErrorMessage message={errorMessage} />}

      {isAdmin && (
        <Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              placeholder="Search by user, email or book"
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
      )}

      {isFetching && (
        <p className="text-sm text-gray-500">Updating results...</p>
      )}

      {!data?.data.length ? (
        <EmptyState message="No loans found." />
      ) : (
        <div className="space-y-4">
          {data.data.map((loan) => (
            <Card key={loan.id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {loan.bookTitle ?? `Book #${loan.bookId}`}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {isAdmin && (
                      <p className="text-sm text-gray-500">
                        User: {loan.userName ?? `User #${loan.userId}`}
                      </p>
                    )}
                  </p>

                  <p className="text-sm text-gray-500">
                    Due date: {new Date(loan.dueDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {loan.status}
                  </span>

                  {loan.status !== "RETURNED" && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setLoanToReturn(loan)}
                    >
                      Return book
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
        isOpen={!!loanToReturn}
        title="Return book"
        message={`Are you sure you want to return "${
          loanToReturn?.bookTitle ?? `Book #${loanToReturn?.bookId}`
        }"?`}
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
