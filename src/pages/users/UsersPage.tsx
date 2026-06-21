import { useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteUser, getUsers, updateUser } from "../../api/users.api";
import { getApiErrorMessage } from "../../utils/get-api-error-message";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { Input } from "../../components/ui/Input";
import { Loading } from "../../components/ui/Loading";
import { Select } from "../../components/ui/Select";

import type { Role, User } from "../../types/user";
import { ConfirmModal } from "../../components/ui/ConfirmModal";

export function UsersPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["users", page, search, role],
    queryFn: () =>
      getUsers({
        page,
        limit: 10,
        search: search || undefined,
        role: role || undefined,
      }),
    placeholderData: keepPreviousData,
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

  if (isLoading && !data) {
    return <Loading message="Loading users..." />;
  }

  if (isError) {
    return <ErrorMessage message="Failed to load users." />;
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-500">
          Manage registered users and their roles.
        </p>
      </div>

      {errorMessage && <ErrorMessage message={errorMessage} />}

      <Card>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            placeholder="Search by name or email"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />

          <Select
            value={role}
            onChange={(event) => {
              setRole(event.target.value as Role | "");
              setPage(1);
            }}
          >
            <option value="">All roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </Select>
        </div>
      </Card>

      {isFetching && (
        <p className="text-sm text-gray-500">Updating results...</p>
      )}

      {!data?.data.length ? (
        <EmptyState message="No users found." />
      ) : (
        <div className="space-y-4">
          {data.data.map((user) => (
            <Card key={user.id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-lg font-semibold text-gray-900">
                  <h2>{user.name}</h2>

                  <p className="text-sm text-gray-500">{user.email}</p>

                  <span className="mt-2 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {user.role}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleToggleRole(user)}
                    disabled={updateUserMutation.isPending}
                  >
                    Change to {user.role === "ADMIN" ? "USER" : "ADMIN"}
                  </Button>

                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => {
                      setErrorMessage("");
                      setUserToDelete(user);
                    }}
                    disabled={deleteUserMutation.isPending}
                  >
                    Delete
                  </Button>
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
        isOpen={!!userToDelete}
        title="Delete user"
        message={`Are you sure you want to delete "${userToDelete?.name}"?`}
        confirmLabel="Delete"
        isLoading={deleteUserMutation.isPending}
        onCancel={() => setUserToDelete(null)}
        onConfirm={() => {
          if (userToDelete) {
            deleteUserMutation.mutate(userToDelete.id, {
              onSuccess: () => setUserToDelete(null),
            });
          }
        }}
      />
    </section>
  );
}
