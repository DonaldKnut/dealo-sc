import React from "react";
import "./Partners.css";
import companyImages from "@/public/companies-icons/companyImages";
import Image from "next/image";
import { Reveal } from "@/app/reveal";

type Props = {};

const Partners = (props: Props) => {
  return (
    <div className="partners-wrapper mt-7">
      <div className="partners">
        <Reveal>
          <h3 className="text-white">Trusted By: </h3>
        </Reveal>
        <div className="logo-wrap">
          <Reveal>
            <Image
              src={companyImages.googleImage}
              alt=""
              className="partner-logo"
            />
          </Reveal>
        </div>
        <div className="logo-wrap">
          <Reveal>
            <Image
              src={companyImages.microsoftImage}
              alt=""
              className="partner-logo"
            />
          </Reveal>
        </div>
        <div className="logo-wrap">
          <Reveal>
            <Image
              src={companyImages.spotifyImage}
              alt=""
              className="partner-logo"
            />
          </Reveal>
        </div>
        <div className="logo-wrap">
          <Reveal>
            <Image
              src={companyImages.linkedInImage}
              alt=""
              className="partner-logo"
            />
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default Partners;
