import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { useAuth } from "../../hooks/use-auth";
import { getApiErrorMessage } from "../../utils/get-api-error-message";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

import { profileSchema } from "./profile.schema";
import type { ProfileFormData } from "./profile.schema";
import { updateProfileRequest } from "../../api/auth.api";

export function ProfilePage() {
  const { user, updateAuthenticatedUser } = useAuth();

  const initials =
    user?.name
      ?.split(" ")
      .map((name) => name[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "U";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileFormData) => {
      if (!user) {
        throw new Error("User not found");
      }

      return updateProfileRequest(data);
    },

    onSuccess: (updatedUser) => {
      updateAuthenticatedUser(updatedUser);
      toast.success("Profile updated successfully");
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to update profile"));
    },
  });

  function onSubmit(data: ProfileFormData) {
    updateProfileMutation.mutate(data);
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500">
          View and update your account information.
        </p>
      </div>

      <Card>
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
            {initials}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.name}
            </h2>

            <p className="text-sm text-gray-500">{user?.email}</p>

            <span className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Name"
              autoComplete="name"
              error={errors.name?.message}
              {...register("name")}
            />

            <Input
              label="Email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
