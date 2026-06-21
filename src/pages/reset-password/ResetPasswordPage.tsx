import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { resetPasswordRequest } from "../../api/auth.api";
import { getApiErrorMessage } from "../../utils/get-api-error-message";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { Input } from "../../components/ui/Input";

import { resetPasswordSchema } from "./reset-password.schema";
import type { ResetPasswordFormData } from "./reset-password.schema";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(data: ResetPasswordFormData) {
    if (!token) return;

    try {
      await resetPasswordRequest({
        token,
        newPassword: data.newPassword,
      });

      toast.success("Password reset successfully");

      navigate("/login");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to reset password"));
    }
  }

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <ErrorMessage message="Invalid or missing reset token." />

          <p className="mt-6 text-center text-sm text-gray-500">
            <Link
              to="/forgot-password"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Request a new reset link
            </Link>
          </p>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reset password</h1>

          <p className="text-sm text-gray-500">
            Create a new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            autoComplete="new-password"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />

          <Input
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Resetting..." : "Reset password"}
          </Button>
        </form>
      </Card>
    </main>
  );
}
