"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SpotifyCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "placeholder"
  >("placeholder");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Placeholder: Spotify OAuth callback is disabled for now
    console.warn(
      "Spotify OAuth callback handling is disabled. This will be implemented later."
    );
    setStatus("placeholder");
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-pink-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                Connecting to Spotify...
              </h2>
              <p className="text-muted-foreground">
                Please wait while we complete your Spotify authorization.
              </p>
            </>
          )}

          {status === "placeholder" && (
            <>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-yellow-700 dark:text-yellow-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M12 18.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-yellow-700 dark:text-yellow-300">
                Spotify connection is disabled
              </h2>
              <p className="text-muted-foreground mb-4 text-sm">
                The Spotify authorization flow will be implemented later. This
                page is a placeholder.
              </p>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                Go to Dashboard
              </button>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">
                Successfully Connected!
              </h2>
              <p className="text-muted-foreground mb-4">
                Your Spotify account has been connected successfully.
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting to dashboard...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-red-600 dark:text-red-400">
                Connection Failed
              </h2>
              <p className="text-muted-foreground mb-4">
                {error || "An error occurred while connecting to Spotify."}
              </p>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                Return to Dashboard
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
