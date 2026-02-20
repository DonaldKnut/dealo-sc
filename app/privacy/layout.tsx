// layouts/PrivacyLayout.tsx
"use client";

import React from "react";
import PrivacyNavbar from "./_components/PrivacyNavbar";
import PrivacySidebar from "./_components/PrivacySidebar";

const PrivacyLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#353333] text-white">
      <PrivacyNavbar />

      <div className="flex pt-20">
        <PrivacySidebar />
        <main className="flex-1 px-4 pb-10 md:px-8 max-w-4xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PrivacyLayout;
