import React from "react";
import Link from "next/link";
import Image from "next/image";

const LogoSection: React.FC = () => {
  return (
    <div className="flex items-center space-x-4">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/dealo_logo.png"
          alt="Dealo's logo"
          className="cursor-pointer"
          width={120}
          height={120}
        />
        <span className="text-lg font-bold text-white hidden sm:block">
          Dealo
        </span>
      </Link>
    </div>
  );
};

export default LogoSection;
