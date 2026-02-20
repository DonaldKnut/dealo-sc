"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // Import the useRouter hook

type Props = {};

const HeaderX = (props: Props) => {
  const [isSticky, setIsSticky] = useState(false);
  const router = useRouter(); // Initialize the useRouter hook

  const handleScroll = () => {
    setIsSticky(window.scrollY > 100);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`flex justify-between items-center p-4 ${
        isSticky
          ? "sticky top-0 bg-[rgba(44,64,52,0.8)] text-black shadow-lg z-50 backdrop-blur-lg"
          : "bg-[#323232]"
      } transition-all duration-300`}
    >
      <div className="w-[85%] flex justify-between p-5 m-auto">
        <Link href="/">
          <Image
            src="https://res.cloudinary.com/dxojy40bv/image/upload/v1755825606/DEALO_ICON_utffca.png"
            alt="Dealo"
            width={48}
            height={48}
            className="w-10 h-10 lg:w-12 lg:h-12"
          />
        </Link>
        <Button onClick={() => router.push("/pricing")}>Go Premium</Button>{" "}
        {/* Updated Button */}
      </div>
    </div>
  );
};

export default HeaderX;
