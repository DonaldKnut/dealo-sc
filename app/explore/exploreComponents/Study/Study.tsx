import React from "react";
import Image from "next/image";
import Button from "../Button/Button";
import { FaSquareArrowUpRight } from "react-icons/fa6";
import "./Study.css";
import { LuCheckCircle2 } from "react-icons/lu";
import { Reveal } from "@/app/reveal";

type Props = {};

const Study = (props: Props) => {
  const studyImage = `https://res.cloudinary.com/dyaetoldv/image/upload/v1724860609/pobii58hg7bus8q77q8j.png`;
  return (
    <div className="study_to_japa_section mt-19">
      <div className="study_to_japa_sub_container">
        <Reveal>
          <h1 className="text-6xl playfair-italic py-4 font-bold">
            Learn, Earn, and Repay
          </h1>
        </Reveal>
        <Reveal>
          <p className="py-4 text-xl onboad_text">
            Our Learning Management Systems boasts a collection of specialized
            courses tailored for passionate travel enthusiasts like yourself. By
            accelerating your skill development, you not only become a confident
            traveler but also gain the capacity to repay your travel loan
            sooner.
          </p>
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
                Our photography courses teach you the art of storytelling
                through images, creating visual narratives that showcase your
                travel adventures.
              </p>
            </Reveal>
          </div>
        </div>
        <div className="apply_btn_wrap_wrapper">
          <Reveal>
            <Button
              type="button"
              title="Start Learning"
              icon={<FaSquareArrowUpRight />}
              variant="btn_green_rounded"
            />
          </Reveal>
        </div>
      </div>
      <div className="py-6">
        <Image
          src={studyImage}
          alt="study to japa"
          width={500}
          height={500}
          className="skill_image"
        />
      </div>
    </div>
  );
};

export default Study;
