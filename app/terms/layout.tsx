// layouts/DefaultLayout.tsx
"use client";

import React from "react";
import TermsNavbar from "./_components/TermsNavbar";
import Sidebar from "./_components/Sidebar";

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <main className="relative w-full">
        <TermsNavbar />

        <div className="flex">
          <Sidebar />

          <section className="flex min-h-screen bg-[#323232] flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14">
            <div className="w-full">{children}</div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DefaultLayout;
