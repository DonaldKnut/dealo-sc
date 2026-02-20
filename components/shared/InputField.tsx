import React, { useState } from "react";
import { Controller } from "react-hook-form";

interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  control: any;
  errors?: any;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  type = "text",
  control,
  errors = {},
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative">
      <label htmlFor={name} className="block text-green-300 mb-1">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            id={name}
            {...field}
            type={type === "password" && showPassword ? "text" : type}
            className="w-full px-4 py-2 border border-[#65a363] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-gray-800"
          />
        )}
      />
      {/* Password Toggle Button - Only shown for password fields */}
      {type === "password" && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-10 text-gray-600 text-sm focus:outline-none"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      )}
      {/* Error Message */}
      {errors[name]?.message && (
        <span className="text-red-500 text-sm">
          {typeof errors[name].message === "string" ? errors[name].message : ""}
        </span>
      )}
    </div>
  );
};

export default InputField;
