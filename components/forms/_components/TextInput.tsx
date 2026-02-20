import React, { useState } from "react";
import { Controller, Control } from "react-hook-form";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface TextInputProps {
  name: string;
  label: string;
  control: Control<any>;
  type?: string;
  isTextArea?: boolean;
  errorMessage?: string;
  maxWords?: number;
  placeholder?: string;
  className?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  name,
  label,
  control,
  type = "text",
  isTextArea = false,
  errorMessage,
  maxWords,
  placeholder,
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const validateWordCount = (value: string) => {
    if (!value || !maxWords) return true;
    const wordCount = value.trim().split(/\s+/).length;
    return (
      wordCount <= maxWords ||
      `Description should not exceed ${maxWords} words.`
    );
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-1">
        <label htmlFor={name} className="block text-gray-200 font-semibold text-sm">
          {label}
        </label>
        {isTextArea && maxWords && (
          <div className="relative group">
            <AiOutlineQuestionCircle className="text-gray-400 text-lg cursor-pointer" />
            <div className="absolute left-0 mt-1 px-2 py-1 rounded bg-black text-white text-xs hidden group-hover:block z-10">
              Describe the job with no more than {maxWords} words.
            </div>
          </div>
        )}
      </div>
      <Controller
        name={name}
        control={control}
        rules={{
          validate: isTextArea && maxWords ? validateWordCount : undefined,
        }}
        render={({ field }) =>
          isTextArea ? (
            <textarea
              id={name}
              {...field}
              placeholder={placeholder}
              className={`w-full px-4 py-3 bg-slate-800/60 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-white placeholder:text-gray-500 backdrop-blur-sm hover:border-white/30 transition-all ${className}`}
            />
          ) : (
            <div className="relative">
              <input
                id={name}
                type={
                  type === "password" && !showPassword
                    ? "password"
                    : type === "number" || type === "date"
                    ? type
                    : "text"
                }
                {...field}
                value={field.value ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  // For number inputs, keep as string to match schema expectations
                  // The schema will handle validation and transformation
                  field.onChange(value);
                }}
                placeholder={placeholder}
                className={`w-full px-4 py-3 bg-slate-800/60 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-white placeholder:text-gray-500 backdrop-blur-sm hover:border-white/30 transition-all ${className}`}
              />
              {type === "password" && (
                <div
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </div>
              )}
            </div>
          )
        }
      />
      {errorMessage && (
        <span className="text-red-400 text-sm mt-2 block flex items-center gap-1 font-medium">{errorMessage}</span>
      )}
    </div>
  );
};

export default TextInput;
