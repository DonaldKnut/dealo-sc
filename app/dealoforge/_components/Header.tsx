import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {};

const Header = (props: Props) => {
  return (
    <div className="flex justify-between p-5 shadow-md w-[85%] m-auto">
      <Link href="/">
        <Image src="/forge.png" alt="forge icon" width={150} height={150} />
      </Link>
      <Button>Get Started</Button>
    </div>
  );
};

export default Header;
