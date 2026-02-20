// src/components/forms/SelectInput.tsx
import React from "react";
import { Briefcase } from "lucide-react";

interface SelectInputProps {
  label: string;
  name: string;
  options: string[];
  register: any;
  errorMessage?: string;
  icon?: React.ReactNode;
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  name,
  options,
  register,
  errorMessage,
  icon = <Briefcase size={20} className="text-green-600" />,
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="font-semibold text-gray-700 mb-2 flex items-center gap-2"
      >
        {icon}
        {label}
      </label>
      <select
        {...register(name)}
        className={`w-full border p-4 rounded-lg shadow-sm ${
          errorMessage
            ? "border-red-500 focus:ring-red-500"
            : "focus:ring-green-600"
        }`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default SelectInput;
