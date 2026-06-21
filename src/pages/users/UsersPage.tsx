import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { deleteUser, getUsers, updateUser } from "../../api/users.api";
import { getApiErrorMessage } from "../../utils/get-api-error-message";

import type { Role, User } from "../../types/user";

export function UsersPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [errorMessage, setErrorMessage] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", page, search, role],
    queryFn: () =>
      getUsers({
        page,
        limit: 10,
        search: search || undefined,
        role: role || undefined,
      }),
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setErrorMessage("");
    },
    onError: (error) => {
      setErrorMessage(getApiErrorMessage(error, "Failed to update user"));
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setErrorMessage("");
    },
    onError: (error) => {
      setErrorMessage(getApiErrorMessage(error, "Failed to delete user"));
    },
  });

  function handleToggleRole(user: User) {
    updateUserMutation.mutate({
      id: user.id,
      data: {
        role: user.role === "ADMIN" ? "USER" : "ADMIN",
      },
    });
  }

  if (isLoading) {
    return <p>Loading users...</p>;
  }

  if (isError) {
    return <p>Failed to load users.</p>;
  }

  return (
    <section>
      <h1>Users</h1>

      {errorMessage && <p>{errorMessage}</p>}

      <div>
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />

        <select
          value={role}
          onChange={(event) => {
            setRole(event.target.value as Role | "");
            setPage(1);
          }}
        >
          <option value="">All roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
        </select>
      </div>

      <div>
        {data?.data.map((user) => (
          <article key={user.id}>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <p>Role: {user.role}</p>

            <button
              type="button"
              onClick={() => handleToggleRole(user)}
              disabled={updateUserMutation.isPending}
            >
              Change to {user.role === "ADMIN" ? "USER" : "ADMIN"}
            </button>

            <button
              type="button"
              onClick={() => deleteUserMutation.mutate(user.id)}
              disabled={deleteUserMutation.isPending}
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
