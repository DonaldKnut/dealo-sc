import React, { useState } from "react";
import { Controller, Control, UseFormSetValue } from "react-hook-form";

interface LanguagesInputProps {
  name: string;
  label: string;
  control: Control<any>;
  trigger: () => void;
  setValue: UseFormSetValue<any>;
  errorMessage?: string;
}

const LanguagesInput: React.FC<LanguagesInputProps> = ({
  name,
  label,
  control,
  trigger,
  setValue,
  errorMessage,
}) => {
  const [languages, setLanguages] = useState<string[]>([]);

  const addLanguage = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const value = event.currentTarget.value.trim();
      if (value && !languages.includes(value)) {
        event.preventDefault();
        const newLanguages = [...languages, value];
        setLanguages(newLanguages);
        setValue(name, newLanguages); // Set the value as an array
        trigger(); // Trigger validation after setting the value
        event.currentTarget.value = ""; // Clear the input
      }
    }
  };

  const removeLanguage = (language: string) => {
    const updatedLanguages = languages.filter((lang) => lang !== language);
    setLanguages(updatedLanguages);
    setValue(name, updatedLanguages); // Update the form value as an array
    trigger(); // Trigger validation after setting the value
  };

  return (
    <div>
      <label htmlFor={name} className="block text-[#295b1c] mb-1">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <input
              id={name}
              type="text"
              onKeyDown={addLanguage}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <div className="flex flex-wrap mt-2">
              {languages.map((language) => (
                <span
                  key={language}
                  className="bg-green-200 text-green-800 py-1 px-3 rounded-full mr-2 mb-2 cursor-pointer"
                  onClick={() => removeLanguage(language)}
                >
                  {language}
                </span>
              ))}
            </div>
            <input type="hidden" {...field} value={languages.join(",")} />
            {errorMessage && (
              <p className="text-red-500 mt-2">{errorMessage}</p>
            )}
          </>
        )}
      />
    </div>
  );
};

export default LanguagesInput;
