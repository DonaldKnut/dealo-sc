import React from "react";
import "./FlightAdvert.css";
import Image from "next/image";
import { GiCash } from "react-icons/gi";
import "./FlightAdvert.css";
import { LuCheckCircle2 } from "react-icons/lu";
import { Reveal } from "@/app/reveal";

type Props = {};

const FlightAdvert = (props: Props) => {
  const paylaterImage = `https://res.cloudinary.com/dyaetoldv/image/upload/v1724860608/imrvlwmw4nq8iqleiocs.png`;

  return (
    <>
      <div className="background_flight_advert">
        <div className="flight_advert_wrapper">
          <div className="dealo_world_left">
            <Reveal>
              <GiCash className="text-4xl" />
            </Reveal>
            <Reveal>
              <h6 className="playfair-italic text-white dealoworld_text font-bold">
                Seamless Travel Loans <br />@ Competitive Rates.
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
                    Transform into a digital nomad with courses on remote work,
                    online entrepreneurship, and digital marketing.
                  </p>
                </Reveal>
              </div>
              <div className="skill_feature">
                <Reveal>
                  <span>
                    {" "}
                    <LuCheckCircle2 />
                  </span>
                </Reveal>
                <Reveal>
                  <p className="my-2">
                    Transform into a digital nomad with courses on remote work,
                    online entrepreneurship, and digital marketing.
                  </p>
                </Reveal>
              </div>
              <div className="skill_feature">
                <Reveal>
                  <span>
                    {" "}
                    <LuCheckCircle2 />
                  </span>
                </Reveal>
                <Reveal>
                  <p className="my-2">
                    Transform into a digital nomad with courses on remote work,
                    online entrepreneurship, and digital marketing.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
          <div className="dealo_world_right">
            <Image
              src={paylaterImage}
              alt="world dealo"
              width={600}
              height={600}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FlightAdvert;
