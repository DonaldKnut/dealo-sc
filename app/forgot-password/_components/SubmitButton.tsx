import React from "react";

interface SubmitButtonProps {
  loading: boolean;
  isValid: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ loading, isValid }) => {
  return (
    <button
      type="submit"
      disabled={!isValid || loading}
      className={`w-full bg-[#65a363] text-white py-2 px-4 rounded-lg hover:bg-[#4e824b] transition-colors duration-300 ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading ? "Registering..." : "Register"}
    </button>
  );
};

export default SubmitButton;
