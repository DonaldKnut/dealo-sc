import React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { TagsInput } from "react-tag-input-component";
import { Award } from "lucide-react"; // Example icon (customize as needed)

interface SkillsInputProps<T extends FieldValues> {
  name: Path<T>; // Use Path<T> instead of keyof T for proper typing
  control: Control<T>; // Ensures 'control' works with the correct type
  trigger: (name?: Path<T>) => Promise<boolean>;
  setValue: (
    name: Path<T>,
    value: any,
    options?: { shouldValidate: boolean }
  ) => void;
  errorMessage: string;
}

const SkillsInput = <T extends FieldValues>({
  name,
  control,
  trigger,
  setValue,
  errorMessage,
}: SkillsInputProps<T>) => {
  return (
    <div>
      <label
        htmlFor={name as string}
        className="font-semibold text-gray-700 mb-2 flex items-center gap-2"
      >
        <Award size={20} className="text-green-600" />
        Skills
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <TagsInput
            value={value || []}
            onChange={(tags) => {
              onChange(tags);
              setValue(name, tags, { shouldValidate: true });
              trigger(name);
            }}
            placeHolder="Enter skills and press Enter"
          />
        )}
      />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default SkillsInput;
