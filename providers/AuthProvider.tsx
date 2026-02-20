"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <SessionProvider
      refetchInterval={5 * 60} // Refetch session every 5 minutes
      refetchOnWindowFocus={false} // Prevent refetch on window focus
    >
      {children}
    </SessionProvider>
  );
};

export default AuthProvider;
