import React from "react";
import Image from "next/image";
import { Reveal } from "@/app/reveal";

const FooterLogo = () => {
  return (
    <div className="col-span-1 md:col-span-2">
      <div className="flex flex-col space-y-6">
        <Image
          src="/dealo_logo.png"
          alt="Dealo Logo"
          width={99}
          height={38}
          className="w-24 h-auto"
        />
        <Reveal>
          <p className="text-gray-400 text-sm leading-relaxed w-[75%]">
            Dealo forges strategic partnerships with institutions, universities,
            vocational schools, and training centers to offer a platform for
            students and graduates to kickstart their careers.
          </p>
        </Reveal>
      </div>
    </div>
  );
};

export default FooterLogo;
