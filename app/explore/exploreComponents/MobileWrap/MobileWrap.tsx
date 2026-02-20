import React from "react";
import "./MobileWrap.css";
import Image from "next/image";
import { TbDeviceMobileMessage } from "react-icons/tb";
import "./MobileWrap.css";
import { LuCheckCircle2 } from "react-icons/lu";
import { Reveal } from "@/app/reveal";

type Props = {};

const MobileWrap = (props: Props) => {
  const dealoTravelsIphone = `https://res.cloudinary.com/dyaetoldv/image/upload/v1724860611/nxcxwuvhnpkdlpjvcv9m.png`;
  const appleStoreImage = `https://res.cloudinary.com/dtujpq8po/image/upload/v1704478620/cryptoAssets/travelImages/apple_store_kzmutu.png`;
  const androidStoreImage = `https://res.cloudinary.com/dtujpq8po/image/upload/v1704674363/google_play_jklxd0.png`;
  return (
    <>
      <div className="mobile_wrap_advert">
        <div className="mobile_wrap_wrapper gap-8">
          <div className="dealo_world_left">
            <Reveal>
              <Image
                src={dealoTravelsIphone}
                alt="dealo travels iphone"
                width={500}
                height={500}
              />
            </Reveal>
          </div>
          <div className="dealo_world_right">
            <Reveal>
              <TbDeviceMobileMessage className="text-4xl" />
            </Reveal>
            <Reveal>
              <h6 className="playfair-italic text-white dealoworld_text font-bold">
                Immerse yourself in Amazing <br /> User experiences.
              </h6>
            </Reveal>
            <div className="skill_features">
              <div className="skill_feature">
                <Reveal>
                  <span>
                    {" "}
                    <LuCheckCircle2 />
                  </span>
                </Reveal>
                <Reveal>
                  <p className="my-2">
                    Your adventure begins here, where every click leads to new
                    horizons and endless possibilities
                  </p>
                </Reveal>
              </div>
            </div>
            <div className="skill_features">
              <div className="skill_feature">
                <Reveal>
                  <span>
                    {" "}
                    <LuCheckCircle2 />
                  </span>
                </Reveal>
                <Reveal>
                  <p className="my-2">
                    Your adventure begins here, where every click leads to new
                    horizons and endless possibilities
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileWrap;
