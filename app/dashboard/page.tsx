"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSafeSession } from "@/hooks/use-safe-session";

export default function DashboardRedirect() {
  const router = useRouter();
  const session = useSafeSession();
  const { data: sessionData } = session || {};

  useEffect(() => {
    if (sessionData?.user) {
      router.replace("/dealoforge/dashboard");
    } else {
      router.replace("/sign-in");
    }
  }, [sessionData, router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}


