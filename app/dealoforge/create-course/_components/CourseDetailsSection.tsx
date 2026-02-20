"use client";

import React from "react";
import {
  Video,
  Layers,
  ArrowUpCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

type CourseDetailsSectionProps = {
  addVideo: boolean;
  level: string;
  noOfChapters: number;
};

const CourseDetailsSection: React.FC<CourseDetailsSectionProps> = ({
  addVideo,
  level,
  noOfChapters,
}) => (
  <div className="p-6 bg-gradient-to-r from-[#4b8567cc] to-[#3b3a3a] rounded-lg shadow-lg text-white w-[80%] mx-auto max-w-3xl mt-5">
    <div className="flex flex-col space-y-6">
      {/* Video Includes Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-green-600 rounded-full p-3 flex justify-center items-center">
            <Video className="text-white w-10 h-10" />
          </div>
          <span className="text-lg font-semibold">Video Includes:</span>
        </div>
        <div className="flex items-center space-x-2">
          {addVideo ? (
            <>
              <div className="bg-green-600 rounded-full p-3 flex justify-center items-center">
                <CheckCircle className="text-white w-6 h-6" />
              </div>
              <span className="text-green-300">Yes</span>
            </>
          ) : (
            <>
              <div className="bg-red-600 rounded-full p-3 flex justify-center items-center">
                <XCircle className="text-white w-6 h-6" />
              </div>
              <span className="text-red-300">No</span>
            </>
          )}
        </div>
      </div>

      {/* Level Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-green-600 rounded-full p-3 flex justify-center items-center">
            <ArrowUpCircle className="text-white w-10 h-10" />
          </div>
          <span className="text-lg font-semibold">Level:</span>
        </div>
        <span className="text-green-300">{level}</span>
      </div>

      {/* Number of Chapters Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-green-600 rounded-full p-3 flex justify-center items-center">
            <Layers className="text-white w-10 h-10" />
          </div>
          <span className="text-lg font-semibold">Number of Chapters:</span>
        </div>
        <span className="text-green-300">{noOfChapters}</span>
      </div>
    </div>
  </div>
);

export default CourseDetailsSection;
