"use client";

import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./reveal";

const NotFound: FC = () => {
  return (
    <div className="h-screen w-full flex flex-col md:flex-row items-center justify-center bg-gray-100 text-gray-900 px-6">
      {/* Left Section - Image */}
      <Reveal>
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src="/assets/not_found.png"
            alt="Page not found illustration"
            width={455}
            height={455}
            className="w-[80%] md:w-[60%]"
          />
        </div>
      </Reveal>

      {/* Right Section - Text */}
      <Reveal>
        <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
          <p className="text-lg md:text-base font-semibold text-red-500">
            ERROR 404
          </p>
          <h1 className="text-4xl md:text-5xl font-bold">Oops!!</h1>
          <h5 className="text-lg md:text-xl text-gray-600">
            This is not the page you are looking for.
          </h5>
          <p className="text-gray-500">
            Here is a helpful link instead:
            <Link
              href="/"
              className="text-green-600 font-semibold ml-1 hover:underline"
            >
              Home
            </Link>
          </p>
        </div>
      </Reveal>
    </div>
  );
};

export default NotFound;
