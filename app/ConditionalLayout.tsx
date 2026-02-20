"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";
import QueryProvider from "@/providers/QueryProvider";

type Props = {
  children: React.ReactNode;
};

/**
 * Inner layout that uses usePathname. Only rendered after client mount so
 * Next.js PathnameContext is always available (avoids "Cannot read properties of null (reading 'useContext')").
 */
function ConditionalLayoutInner({ children }: Props) {
  const pathname = usePathname();

  const isAuthRoute = Boolean(
    pathname &&
    (pathname.startsWith("/sign-in") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/verify-email") ||
      pathname.startsWith("/forgot-password") ||
      pathname.startsWith("/writers/login") ||
      pathname.startsWith("/writers/signup") ||
      pathname.startsWith("/complete-profile"))
  );

  const isDashboardRoute = Boolean(
    pathname &&
    (pathname.startsWith("/dealoforge/dashboard") ||
      pathname.startsWith("/dashboard"))
  );

  const isVideoChatRoute = Boolean(
    pathname && pathname.startsWith("/video-chat")
  );

  const isMessengerRoute = Boolean(
    pathname && pathname.startsWith("/messenger")
  );

  const isDocsRoute = Boolean(pathname && pathname.startsWith("/docs"));

  const isHeroRoute = pathname === "/" || (pathname?.startsWith("/certification/") && !pathname?.endsWith("/assessment")) || pathname === "/careers" || pathname === "/courses" || pathname === "/partners";

  const hideHeaderFooter = isAuthRoute || isDashboardRoute || isVideoChatRoute || isMessengerRoute || isDocsRoute;

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <main
        className={!hideHeaderFooter && !isHeroRoute ? "pt-16" : undefined}
        style={{ minHeight: '100vh', width: '100%' }}
      >
        {children}
      </main>
      {!hideHeaderFooter && (
        <>
          <Footer />
          <AIChatbot />
        </>
      )}
    </>
  );
}

export default function ConditionalLayout({ children }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <QueryProvider>
      {!mounted ? (
        <main style={{ minHeight: '100vh', width: '100%' }}>
          {children}
        </main>
      ) : (
        <ConditionalLayoutInner>{children}</ConditionalLayoutInner>
      )}
    </QueryProvider>
  );
}
