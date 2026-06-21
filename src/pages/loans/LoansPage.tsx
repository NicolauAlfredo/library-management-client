import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getLoans, returnBook, updateOverdueLoans } from "../../api/loans.api";
import { getApiErrorMessage } from "../../utils/get-api-error-message";

import type { LoanStatus } from "../../types/loan";

export function LoansPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<LoanStatus | "">("");
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["loans", page, status, search],
    queryFn: () =>
      getLoans({
        page,
        limit: 10,
        status: status || undefined,
        search: search || undefined,
      }),
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

  if (isLoading) {
    return <p>Loading loans...</p>;
  }

  if (isError) {
    return <p>Failed to load loans.</p>;
  }

  return (
    <section>
      <h1>Loans</h1>

      {errorMessage && <p>{errorMessage}</p>}

      <div>
        <input
          type="text"
          placeholder="Search by user, email or book"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />

        <select
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
        </select>

        <button
          type="button"
          onClick={() => updateOverdueMutation.mutate()}
          disabled={updateOverdueMutation.isPending}
        >
          {updateOverdueMutation.isPending
            ? "Updating..."
            : "Update overdue loans"}
        </button>
      </div>

      <div>
        {data?.data.map((loan) => (
          <article key={loan.id}>
            <h2>{loan.bookTitle ?? `Book #${loan.bookId}`}</h2>

            <p>User: {loan.userName ?? `User #${loan.userId}`}</p>
            <p>Status: {loan.status}</p>
            <p>Loan date: {new Date(loan.loanDate).toLocaleDateString()}</p>
            <p>Due date: {new Date(loan.dueDate).toLocaleDateString()}</p>

            {loan.returnedAt && (
              <p>
                Returned at: {new Date(loan.returnedAt).toLocaleDateString()}
              </p>
            )}

            {loan.status !== "RETURNED" && (
              <button
                type="button"
                onClick={() => returnLoanMutation.mutate(loan.id)}
                disabled={returnLoanMutation.isPending}
              >
                Return book
              </button>
            )}
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
