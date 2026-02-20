"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, Database } from "lucide-react";

export default function SeedJobsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; count?: number; details?: string } | null>(null);
  const [clearFirst, setClearFirst] = useState(false);
  const router = useRouter();

  const handleSeed = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/jobs/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clear: clearFirst }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || "Failed to seed jobs",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Database className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Seed Jobs Database</h1>
              <p className="text-gray-600">Fetch and populate jobs from Remotive API</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This will fetch jobs from the Remotive API and save them to your database.
                The process may take a few minutes.
              </p>
            </div>

            {result && !result.success && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Troubleshooting MongoDB Connection Issues:</h3>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Check your <code className="bg-blue-100 px-1 rounded">MONGODB_URL</code> or <code className="bg-blue-100 px-1 rounded">MONGODB_URI</code> environment variable</li>
                  <li>If using MongoDB Atlas, ensure your IP address is whitelisted</li>
                  <li>Verify your internet connection is working</li>
                  <li>Check MongoDB Atlas cluster status in the dashboard</li>
                  <li>Ensure your connection string includes proper authentication credentials</li>
                </ul>
              </div>
            )}

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="clear"
                checked={clearFirst}
                onChange={(e) => setClearFirst(e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="clear" className="text-sm text-gray-700 cursor-pointer">
                Clear existing jobs before seeding
              </label>
            </div>

            <button
              onClick={handleSeed}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-lg font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Seeding Jobs...
                </>
              ) : (
                <>
                  <Database className="w-5 h-5" />
                  Seed Jobs
                </>
              )}
            </button>

            {result && (
              <div
                className={`p-4 rounded-lg border ${
                  result.success
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.success ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p
                      className={`font-semibold whitespace-pre-line ${
                        result.success ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {result.message}
                    </p>
                    {result.count !== undefined && (
                      <p className="text-sm text-gray-600 mt-1">
                        {result.count} jobs have been added to the database.
                      </p>
                    )}
                    {!result.success && result.details && (
                      <div className="mt-3 p-2 bg-red-100 rounded text-xs text-red-700 font-mono overflow-auto">
                        {result.details}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={() => router.push("/employment")}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Back to Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

