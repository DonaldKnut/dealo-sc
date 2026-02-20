"use client";

import { useSafeSession } from "@/hooks/use-safe-session";

export default function AuthTest() {
  const session = useSafeSession();
  const { data: sessionData, status } = session || {};

  return (
    <div className="fixed top-20 right-4 bg-black p-4 rounded-lg text-white z-50">
      <h3 className="font-bold mb-2">Auth Status:</h3>
      <p>Status: {status}</p>
      <p>User: {sessionData?.user?.email || "Not logged in"}</p>
      <p>Name: {sessionData?.user?.name || "No name"}</p>
    </div>
  );
}



