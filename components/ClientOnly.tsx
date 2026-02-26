"use client";

import { useEffect, useState, ReactNode } from "react";

/**
 * Renders children only after client mount. Prevents "Cannot read properties
 * of null (reading 'useContext')" when navigation hooks (usePathname, etc.)
 * run during SSR before Next.js PathnameContext is available.
 */
export default function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="min-h-screen w-full bg-gradient-to-br from-black via-[#0f1a0f] to-black"
        style={{ minHeight: "100vh" }}
        aria-busy="true"
      />
    );
  }

  return <>{children}</>;
}
