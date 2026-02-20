"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Search } from "lucide-react";
import Link from "next/link";

export default function MarketplaceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Marketplace error:", error);
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
              Failed to Load Marketplace
            </h1>

            <p className="text-gray-400 mb-6">
              We couldn&apos;t load the marketplace items. Please try again.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={reset}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reload
              </button>

              <Link
                href="/explore"
                className="flex-1 btn-secondary flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Explore More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

