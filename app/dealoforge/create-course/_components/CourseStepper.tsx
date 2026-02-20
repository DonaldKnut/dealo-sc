// File: /components/course-creation/CourseStepper.tsx

import Image from "next/image";

interface Step {
  id: number;
  name: string;
  imgURL: string;
  alt: string;
}

interface CourseStepperProps {
  activeIdx: number;
}

const steps: Step[] = [
  { id: 1, name: "Category", imgURL: "/icons/ai_two.png", alt: "forge icons" },
  {
    id: 2,
    name: "Topic & Desc",
    imgURL: "/icons/topic_and_desc.png",
    alt: "forge icons",
  },
  {
    id: 3,
    name: "Options",
    imgURL: "/icons/business_convo.png",
    alt: "forge icons",
  },
];

const CourseStepper: React.FC<CourseStepperProps> = ({ activeIdx }) => {
  return (
    <div className="flex justify-center gap-8 mt-10">
      {steps.map((step, idx) => (
        <div className="flex items-center" key={step.id}>
          <div className="flex flex-col items-center w-[60px] md:w-[100px]">
            <Image src={step.imgURL} alt={step.alt} width={75} height={75} />
            <h2 className="text-white md:hidden">{step.name}</h2>
          </div>
          {idx !== steps.length - 1 && (
            <div
              className={`h-1 w-[50px] md:w-[100px] rounded-full lg:w-[170px] ${
                activeIdx >= idx ? "bg-[#50e842]" : "bg-gray-300"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseStepper;
