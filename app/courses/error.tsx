"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, BookOpen } from "lucide-react";
import Link from "next/link";

export default function CoursesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Courses error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-dark py-8">
      <div className="container mx-auto px-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="card-premium text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-3">
              Failed to Load Courses
            </h1>

            <p className="text-gray-400 mb-6">
              We couldn&apos;t load the courses. This might be a temporary issue.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={reset}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>

              <Link
                href="/learn"
                className="flex-1 btn-secondary flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Browse Learning
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

