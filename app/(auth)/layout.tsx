import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Dealo Talent Network",
  description: "Sign in or register for Dealo Talent Network.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}
