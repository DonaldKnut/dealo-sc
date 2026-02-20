"use client";
import Image from "next/image";

export default function ForgeComponent() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-between bg-[#2c4034] p-8 m-auto w-[85%] my-10 rounded-[60px]">
      {/* Text Section */}
      <div className="text-center lg:text-left lg:w-1/2">
        <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
          Unleash your potential <br className="hidden md:inline" /> with{" "}
          <span className="playfair-italic font-bold text-[#7df012]">
            Forge
          </span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mb-8">
          Our AI-powered platform enables you to create personalized courses
          tailored to individual learning needs, enhancing the educational
          experience for both instructors and students.
        </p>

        {/* Search bar */}
        {/* <div className="flex justify-center lg:justify-start">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="px-6 py-3 rounded-full w-64 md:w-80 bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 px-4 py-2 rounded-full">
              search
            </button>
          </div>
        </div> */}
        <div className="flex justify-center lg:justify-start gap-4">
          <div>
            <Image
              src="/backpack.png"
              alt="backpack icon"
              width="70"
              height="70"
            />
          </div>

          <div>
            <Image
              src="/booky.png"
              alt="backpack icon"
              width="70"
              height="70"
            />
          </div>
          <div>
            <Image
              src="/books.png"
              alt="backpack icon"
              width="83"
              height="83"
            />
          </div>
          <div>
            <Image
              src="/schooly.png"
              alt="backpack icon"
              width="70"
              height="70"
            />
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="mt-10 lg:mt-0 flex justify-center lg:w-1/2">
        <Image
          src="/jobs_img.png" // Update this to the correct path
          alt="Green Robot"
          className="w-48 md:w-96 object-contain"
          width="170"
          height="170"
        />
      </div>
    </div>
  );
}
