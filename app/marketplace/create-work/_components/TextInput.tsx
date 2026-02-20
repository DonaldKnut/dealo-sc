// src/components/forms/TextInput.tsx
import React from "react";
import { Edit2 } from "lucide-react";

interface TextInputProps {
  label: string;
  name: string;
  placeholder: string;
  register: any;
  type?: string;
  errorMessage?: string;
  setValue?: (
    name: string,
    value: any,
    options?: { shouldValidate: boolean }
  ) => void;
  icon?: React.ReactNode;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  placeholder,
  register,
  type = "text",
  errorMessage,
  setValue,
  icon = <Edit2 size={20} className="text-green-600" />,
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
      <input
        type={type}
        {...register(name)}
        placeholder={placeholder}
        className={`w-full border p-4 rounded-lg shadow-sm focus:ring-2 ${
          errorMessage
            ? "border-red-500 focus:ring-red-500"
            : "focus:ring-green-600"
        }`}
        onChange={(e) =>
          setValue
            ? setValue(name, e.target.value, { shouldValidate: true })
            : undefined
        }
      />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default TextInput;
