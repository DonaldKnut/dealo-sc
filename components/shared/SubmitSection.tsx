"use client";

import React from "react";

interface SubmitSectionProps {
  isLoading: boolean;
  isValid: boolean;
  termsAccepted: boolean;
}

const SubmitSection: React.FC<SubmitSectionProps> = ({
  isLoading,
  isValid,
  termsAccepted,
}) => {
  return (
    <div className="mt-6">
      <button
        type="submit"
        disabled={!isValid || !termsAccepted || isLoading}
        className={`w-full py-3 rounded-xl font-semibold text-white ${
          isValid && termsAccepted && !isLoading
            ? "bg-[#33db28] hover:bg-[#2bc422]"
            : "bg-gray-500 cursor-not-allowed"
        }`}
      >
        {isLoading ? "Registering..." : "Register"}
      </button>
    </div>
  );
};

export default SubmitSection;
