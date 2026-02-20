"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const TermsNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-[#2e2f2e] px-6 py-4 flex items-center justify-between shadow-md">
      {/* Logo */}
      <Link href="/" className="flex items-right gap-2">
        <Image
          src="/dealo_logo.png"
          alt="Dealo's logo"
          className="cursor-pointer"
          width={100}
          height={40}
        />
      </Link>
    </nav>
  );
};

export default TermsNavbar;
