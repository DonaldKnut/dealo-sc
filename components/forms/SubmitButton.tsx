import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";

interface ButtonProps {
  isLoading?: boolean;
  isValid?: boolean;
  className?: string;
  children?: React.ReactNode; // Children can still be optional
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  label?: string; // New prop for button label
}

const SubmitButton: React.FC<ButtonProps> = ({
  isLoading = false,
  isValid = true,
  className,
  children,
  disabled,
  type = "submit",
  label = "Submit", // Default label
}) => {
  return (
    <Button
      type={type}
      className={className ?? "shad-primary-btn w-full hover:bg-green-600"}
      disabled={isLoading || disabled || !isValid} // Updated to consider isValid
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          Loading...
          <Image
            src="/assets/icons/loader.svg"
            alt="loader"
            width={24}
            height={24}
            className="animate-spin"
          />
        </div>
      ) : (
        label || children // Use label prop or children if provided
      )}
    </Button>
  );
};

export default SubmitButton;
