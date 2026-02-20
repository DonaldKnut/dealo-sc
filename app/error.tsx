"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console or monitoring service
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card-premium text-center">
          {/* Error icon */}
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-3">
            Oops! Something went wrong
          </h1>

          <p className="text-gray-400 mb-6">
            We encountered an unexpected error. Don&apos;t worry, our team has been
            notified.
          </p>

          {/* Error details in development */}
          {process.env.NODE_ENV === "development" && (
            <details className="mb-6 text-left">
              <summary className="text-sm text-gray-400 cursor-pointer mb-2 hover:text-white transition-colors">
                Error Details (Development Only)
              </summary>
              <div className="bg-dark-200 rounded-lg p-4 text-xs text-red-300 font-mono overflow-auto max-h-32">
                <p>
                  <strong>Message:</strong> {error.message}
                </p>
                {error.digest && (
                  <p>
                    <strong>Digest:</strong> {error.digest}
                  </p>
                )}
              </div>
            </details>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={reset}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>

            <Link
              href="/"
              className="flex-1 btn-secondary flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </div>
        </div>

        {/* Support link */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Need help?{" "}
          <Link
            href="/contact"
            className="text-brand-green hover:text-brand-green-light transition-colors"
          >
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}

