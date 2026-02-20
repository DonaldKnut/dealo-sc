import React from "react";
import Link from "next/link";

const ScrollSubmenu: React.FC = () => {
  return (
    <div className="bg-green-700 py-2 shadow-md">
      <div className="container mx-auto flex justify-around">
        <Link href="/" className="text-white hover:text-green-300">
          Engineering & Law
        </Link>
        <Link href="/" className="text-white hover:text-green-300">
          Graphics & Design
        </Link>
        <Link href="/" className="text-white hover:text-green-300">
          Video & Animation
        </Link>
        <Link href="/" className="text-white hover:text-green-300">
          Writing & Translation
        </Link>
        <Link href="/" className="text-white hover:text-green-300">
          AI Services
        </Link>
        <Link href="/" className="text-white hover:text-green-300">
          Digital Marketing
        </Link>
        <Link href="/" className="text-white hover:text-green-300">
          Music & Fashion
        </Link>
        <Link href="/" className="text-white hover:text-green-300">
          Programming & Tech
        </Link>
      </div>
    </div>
  );
};

export default ScrollSubmenu;
