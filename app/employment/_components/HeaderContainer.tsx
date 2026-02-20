"use client";
import { useEffect, useState } from "react";
import { getSession, signOut } from "next-auth/react";
import Header from "./Header";

// Define a type for the user
type UserType = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
} | null;

function HeaderContainer() {
  const [user, setUser] = useState<UserType>(null);

  useEffect(() => {
    async function loadSession() {
      const session = await getSession();
      setUser(session?.user ?? null);
    }

    loadSession();
  }, []);

  // Use the environment variable for the WorkOS redirect URI
  const signInUrl = process.env.WORKOS_REDIRECT_URI || "/api/auth/callback";

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return <Header user={user} signInUrl={signInUrl} onLogout={handleLogout} />;
}

export default HeaderContainer;
