import React from "react";
import Image from "next/image";

type CourseHeaderProps = {
  name: string;
  category: string;
  level: string;
  courseDuration: string;
  imagePath: string;
};

const CourseHeader: React.FC<CourseHeaderProps> = ({
  name,
  category,
  level,
  courseDuration,
  imagePath,
}) => {
  return (
    <div className="m-3 text-white p-6 shadow-md rounded-[12px]">
      {/* Left Section - Text */}
      <div className="w-[80%] m-auto flex flex-col md:flex-row items-center justify-between">
        {/* Left Section - Image */}
        <div className="md:w-1/2 flex justify-center items-center mt-4 md:mt-0">
          <div className="relative min-h-[16rem] min-w-[16rem] md:min-h-[20rem] md:min-w-[20rem]">
            <Image
              src={imagePath}
              alt={name}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
              priority // Ensures the image loads quickly on mobile devices
            />
          </div>
        </div>

        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold mb-2 playfair-italic">
            Course Layout
          </h2>
          <p className="text-lg">
            <strong>Category:</strong>{" "}
            <span className="p-3 rounded-[12px] mt-3 mb-3">{category}</span>
          </p>
          <p className="text-lg">
            <strong>Level:</strong> {level}
          </p>
          <p className="text-lg">
            <strong>Duration:</strong> {courseDuration}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
