// File: CourseBasicInfoPage.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaPalette } from "react-icons/fa"; // Icon for displaying course category
import { Edit } from "lucide-react"; // Icon for editing button
import Image from "next/image";

type CourseBasicInfoPageProps = {
  courseId: string; // Unique identifier for the course
  chapterName: string; // Name of the chapter
  chapterDescription: string; // Description of the chapter
  courseName: string; // Name of the course
  courseCategory: string; // Category of the course
  imagePath: string; // Path to the course image
  isAuthor: boolean; // Indicates if the current user is the course author
};

const CourseBasicInfoPage: React.FC<CourseBasicInfoPageProps> = ({
  courseId,
  chapterName,
  chapterDescription,
  courseName,
  courseCategory,
  imagePath,
  isAuthor,
}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const defaultImageUrl = "/course_icon.png"; // Default image path if no image is provided
  const router = useRouter(); // Router instance for handling navigation

  // Fetch image from provided path or use the default image if not available
  useEffect(() => {
    setImageUrl(imagePath || defaultImageUrl);
  }, [imagePath]);

  // Handler for navigating to the course details page when the "Start" button is clicked
  const handleStartCourse = () => {
    router.push(`/dealoforge/courses/${courseId}`);
  };

  return (
    <div className="bg-[#3b3b3b] m-auto items-center h-full p-8 justify-center">
      {/* Course Information Section */}
      <div className="w-[85%] mb- flex flex-col md:flex-row justify-center items-center m-auto">
        <div className="flex flex-col p-6 text-left bg-gradient-to-r from-[#4b8567cc] to-[#3b3a3a] rounded-lg shadow-lg space-y-4 text-white w-full md:w-2/3 h-full">
          {/* Course Title and Edit Button */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{courseName}</h1>
            {isAuthor && (
              <button className="ml-2 p-1 bg-white rounded-full">
                <Edit className="text-green-700" />
              </button>
            )}
          </div>

          {/* Chapter Name and Edit Button */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl">{chapterName}</h2>
            {isAuthor && (
              <button className="ml-2 p-1 bg-white rounded-full">
                <Edit className="text-green-700" />
              </button>
            )}
          </div>

          {/* Chapter Description and Edit Button */}
          <div className="flex justify-between items-center">
            <p className="text-sm">{chapterDescription}</p>
            {isAuthor && (
              <button className="ml-2 p-1 bg-white rounded-full">
                <Edit className="text-green-700" />
              </button>
            )}
          </div>

          {/* Course Category with Icon and Edit Button */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FaPalette className="text-2xl" />
              <span className="text-lg">{courseCategory}</span>
            </div>
            {isAuthor && (
              <button className="ml-2 p-1 bg-white rounded-full">
                <Edit className="text-green-700" />
              </button>
            )}
          </div>

          {/* Start Course Button */}
          <button
            onClick={handleStartCourse}
            className="mt-4 py-2 px-6 bg-white text-green-700 font-bold rounded hover:bg-gray-200 transition-all duration-200"
          >
            Start
          </button>
        </div>

        {/* Course Image Section */}
        <div className="md:w-3/4 p-6 mt-6 md:mt-0">
          <Image
            src={imageUrl ?? defaultImageUrl} // Use the resolved imageUrl or fallback to default
            alt={courseName}
            width={479}
            height={322}
            className="rounded-[33px] object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default CourseBasicInfoPage;
