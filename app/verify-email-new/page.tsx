import { Suspense } from "react";
import ModernVerifyEmailForm from "./_components/ModernVerifyEmailForm";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

export default function ModernVerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
            <p className="text-lg">Loading verification page...</p>
          </div>
        </div>
      }
    >
      <ModernVerifyEmailForm />
    </Suspense>
  );
}
