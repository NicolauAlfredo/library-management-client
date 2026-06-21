import axios from "axios";
import type { ApiErrorResponse } from "../types/api";

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = "Unexpected error",
): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data.message ?? fallbackMessage;
  }

  return fallbackMessage;
}
