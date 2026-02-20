import React, { useState } from "react";
import { Controller, Control, UseFormSetValue } from "react-hook-form";
import { X, Plus } from "lucide-react";

interface SkillsInputProps {
  name: string;
  label: string;
  control: Control<any>;
  trigger: () => void;
  setValue: UseFormSetValue<any>;
  errorMessage?: string;
}

const SkillsInput: React.FC<SkillsInputProps> = ({
  name,
  label,
  control,
  trigger,
  setValue,
  errorMessage,
}) => {
  const [inputValue, setInputValue] = useState("");
  // NEW: Initialize skills from the current form value to prevent empty state on edits/reload
  const [skills, setSkills] = useState<string[]>(control._defaultValues?.[name] || []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const addSkill = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitSkill();
    }
  };

  const commitSkill = () => {
    const value = inputValue.trim().replace(/,$/, "");
    if (value && !skills.includes(value)) {
      const newSkills = [...skills, value];
      setSkills(newSkills);
      setValue(name, newSkills, { shouldValidate: true });
      trigger();
      setInputValue("");
    }
  };

  const removeSkill = (skill: string) => {
    const updatedSkills = skills.filter((s) => s !== skill);
    setSkills(updatedSkills);
    setValue(name, updatedSkills, { shouldValidate: true });
    trigger();
  };

  return (
    <div className="space-y-3">
      <label htmlFor={name} className="text-xs font-black text-gray-500 uppercase tracking-widest block">
        {label}
      </label>

      <Controller
        name={name}
        control={control}
        render={() => (
          <div className="space-y-3">
            {/* Input row */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  id={name}
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={addSkill}
                  className="w-full bg-white/[0.05] border border-white/15 text-white placeholder-gray-600 px-5 py-3.5 rounded-2xl text-sm font-medium outline-none focus:border-emerald-500/60 focus:bg-white/[0.08] focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                  placeholder="Type a skill and press Enter…"
                />
                {inputValue && (
                  <p className="absolute -bottom-5 left-0 text-[10px] text-amber-500 font-bold animate-pulse">
                    Don't forget to click "Add" or press Enter!
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={commitSkill}
                className="flex items-center gap-2 px-5 py-3.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 font-black text-xs uppercase tracking-wider rounded-2xl transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {/* Skill tags */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl group"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-emerald-500/50 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {skills.length === 0 && (
              <p className="text-gray-700 text-xs font-medium">
                No skills added yet. Type a skill above and press <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-gray-500 font-mono">Enter</kbd> or click Add.
              </p>
            )}
          </div>
        )}
      />

      {errorMessage && (
        <p className="text-red-400 text-xs font-bold">{errorMessage}</p>
      )}
    </div>
  );
};

export default SkillsInput;
