"use client";

import axios, { type AxiosError } from "axios";

/**
 * Central client-side error-code handling.
 *
 * All client requests go through the shared `axios` instance. This installs a
 * single response interceptor so error codes can be handled in one place.
 *
 * For now only `ACCOUNT_DISABLED` is handled: it redirects the user to a
 * dedicated page instead of leaving them on a broken UI. Other error codes are
 * passed through unchanged for callers to handle.
 */

export const ACCOUNT_DISABLED_PATH = "/account-disabled";

interface ApiErrorBody {
  code?: string;
}

let installed = false;

export function setupApiInterceptors(): void {
  if (installed) return;
  installed = true;

  axios.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorBody>) => {
      const code = error.response?.data?.code;

      if (
        code === "ACCOUNT_DISABLED" &&
        typeof window !== "undefined" &&
        window.location.pathname !== ACCOUNT_DISABLED_PATH
      ) {
        window.location.href = ACCOUNT_DISABLED_PATH;
      }

      return Promise.reject(error);
    },
  );
}

export { axios };
