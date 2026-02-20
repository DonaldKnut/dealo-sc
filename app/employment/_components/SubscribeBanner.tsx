import React from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";

interface FormData {
  email: string;
}

const SubscribeBanner: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    alert(`Subscribed with email: ${data.email}`);
    // Handle form submission logic here, e.g., send data to your API endpoint.
  };

  return (
    <div className="bg-[#a4c2a8] p-8 rounded-[23px] flex flex-col md:flex-row items-center justify-between mt-14 mb-14 w-[85%] m-auto">
      {/* Left Section: Text */}
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-6xl font-semibold text-[#30593a]">
          Discover the best <br /> Job Offers for you
        </h1>

        {/* Centered paragraph on smaller screens */}
        <p className="text-lg text-[#30593a] mt-2 mb-4 md:w-[60%] md:mx-0 mx-auto">
          Are you looking for your dream job? Sign up for updates.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center space-x-2"
        >
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            })}
            className="px-4 py-2 border border-[#30593a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30593a]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#30593a] text-white rounded-lg hover:bg-[#204729] transition-colors shadow-lg"
          >
            Subscribe
          </button>
        </form>

        {/* Error Message */}
        {errors.email && (
          <p className="text-red-500 mt-2">{errors.email.message}</p>
        )}
      </div>

      {/* Right Section: Image with Transition Effect */}
      <div className="flex flex-col md:flex-row items-center mt-6 md:mt-0">
        <div className="hidden md:block ml-4 transform transition-transform duration-500 hover:translate-x-4 hover:translate-y-2">
          <Image
            src="/edu_hero.png" // Replace with your image path
            alt="Illustration"
            width={550}
            height={550}
          />
        </div>
      </div>
    </div>
  );
};

export default SubscribeBanner;
