import React from "react";
import { Controller } from "react-hook-form";

interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  control: any;
  errors?: any;
  showPassword?: boolean;
  togglePasswordVisibility?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  type = "text",
  control,
  errors = {}, // Set default
  showPassword,
  togglePasswordVisibility,
}) => {
  return (
    <div className="relative">
      <label htmlFor={name} className="block text-[#8dff70] mb-1">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            id={name}
            {...field}
            type={type}
            className="w-full px-4 py-2 border border-[#65a363] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-gray-800"
          />
        )}
      />
      {togglePasswordVisibility && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-10 text-gray-600"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      )}
      {errors[name]?.message && (
        <span className="text-red-500 text-sm">
          {typeof errors[name].message === "string" ? errors[name].message : ""}
        </span>
      )}
    </div>
  );
};

export default InputField;
