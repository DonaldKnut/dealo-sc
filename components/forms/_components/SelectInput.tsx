import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface Option {
  value: string;
  label: string | React.ReactNode;
}

interface SelectInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: Option[];
  errorMessage?: string;
  value?: string | null; // Add value prop
  onChange?: (value: string) => void; // Add onChange prop
}

const SelectInput = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  errorMessage,
  value,
  onChange,
}: SelectInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div>
          <label htmlFor={name} className="block text-gray-200 font-semibold text-sm mb-2">
            {label}
          </label>
          <select
            id={name}
            {...field}
            value={value || field.value || ""} // Use the value prop
            onChange={(e) => {
              field.onChange(e.target.value); // Update form field
              onChange?.(e.target.value); // Call custom onChange if provided
            }}
            className="w-full px-4 py-3 bg-slate-800/60 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 backdrop-blur-sm hover:border-white/30 transition-all"
          >
            <option value="" disabled>
              Select {label}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errorMessage && (
            <p className="text-red-400 text-sm mt-2 font-medium">{errorMessage}</p>
          )}
        </div>
      )}
    />
  );
};

export default SelectInput;
