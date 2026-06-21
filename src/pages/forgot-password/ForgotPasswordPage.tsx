import { useState } from "react";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { forgotPasswordRequest } from "../../api/auth.api";
import { getApiErrorMessage } from "../../utils/get-api-error-message";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

import { forgotPasswordSchema } from "./forgot-password.schema";
import type { ForgotPasswordFormData } from "./forgot-password.schema";

export function ForgotPasswordPage() {
  const [resetUrl, setResetUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    try {
      const response = await forgotPasswordRequest(data);

      setResetUrl(response.resetUrl);

      toast.success("Password recovery request sent");
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Failed to request password reset"),
      );
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Forgot password</h1>

          <p className="text-sm text-gray-500">
            Enter your email to generate a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="john@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send reset link"}
          </Button>
        </form>

        {resetUrl && (
          <div className="mt-6 rounded-md bg-blue-50 p-3 text-sm text-blue-700">
            <p className="font-medium">Development reset link:</p>

            <Link to={new URL(resetUrl).pathname + new URL(resetUrl).search}>
              Open reset password page
            </Link>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Sign in
          </Link>
        </p>
      </Card>
    </main>
  );
}
