"use client";

// Force dynamic rendering for authentication
export const dynamic = "force-dynamic";

import JobForm from "../../_components/JobForm";
import { useSafeSession } from "@/hooks/use-safe-session";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type PageProps = {
  params: {
    organizationId: string;
  };
};

export default function NewListingForOrgPage({ params }: PageProps) {
  const session = useSafeSession(); const { data: sessionData } = session || {};

  return (
    <div className="flex justify-center items-center h-screen w-[90%] m-auto">
      <section className="remove-scrollbar container">
        <div className="sub-container flex-1 flex-col py-10">
          <Link href="/">
            <Image
              src="/DEALO_ICON_white.png"
              height={120}
              width={120}
              alt="Logo"
              className="mb-12 mt-[243px]"
            />
          </Link>
          <JobForm organizationId={params.organizationId} />
          <p className="copyright py-12">© 2024 Dealo</p>
        </div>
      </section>

      <Image
        src="/abstract-gravity-wave-background.png"
        height={1000}
        width={1000}
        alt="Doctor"
        className="side-img max-w-[390px]"
      />
    </div>
  );
}
