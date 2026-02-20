import React from "react";
import { User, Lock } from "lucide-react";

interface InputFieldProps {
  label: string;
  register?: any; // React Hook Form's `register` method
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: { message: string };
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  register,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
}) => {
  return (
    <div>
      <label className="font-semibold flex items-center gap-2">
        {type === "text" ? (
          <User size={24} color="currentColor" />
        ) : (
          <Lock size={24} color="currentColor" />
        )}
        {label}
      </label>
      <input
        type={type}
        {...register}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border p-4 rounded-lg shadow-sm focus:ring-2 ${
          error ? "border-red-500" : "focus:ring-green-600"
        }`}
      />
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  );
};

export default InputField;
