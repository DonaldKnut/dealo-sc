"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

export default function SignOutPage() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await signOut({ callbackUrl: "/" });
      if (cancelled) return;
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex items-center justify-center h-screen text-white">
      <p className="text-lg">Signing you out...</p>
    </div>
  );
}
