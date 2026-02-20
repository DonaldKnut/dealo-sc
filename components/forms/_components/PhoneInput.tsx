import React from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Controller, Control, FieldErrors } from "react-hook-form";

interface PhoneInputProps {
  name: string;
  label: string;
  control: Control<any>;
  errors?: FieldErrors; // Make `errors` optional to avoid undefined errors
}

const CustomPhoneInput: React.FC<PhoneInputProps> = ({
  name,
  label,
  control,
  errors = {}, // Ensure `errors` is always an object
}) => {
  // Ensure errorMessage is a valid string before rendering
  const errorMessage =
    errors?.[name]?.message && typeof errors[name]?.message === "string"
      ? (errors[name]?.message as string) // Explicitly cast to string
      : "";

  return (
    <div className="space-y-3">
      <label htmlFor={name} className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="relative group/phone">
            <div className={`flex rounded-[1.25rem] bg-white/[0.03] border border-white/[0.08] group-focus-within/phone:border-emerald-500/40 group-focus-within/phone:ring-2 group-focus-within/phone:ring-emerald-500/20 transition-all overflow-hidden backdrop-blur-3xl`}>
              <PhoneInput
                {...field}
                id={name}
                className="flex-1 px-6 py-5 bg-transparent text-white font-bold outline-none custom-phone-input"
                international
                withCountryCallingCode
              />
            </div>
          </div>
        )}
      />
      {errorMessage && (
        <p className="text-[10px] font-black text-red-500/70 uppercase tracking-widest ml-1">{errorMessage}</p>
      )}

      <style jsx global>{`
        .custom-phone-input .PhoneInputCountry {
          margin-right: 12px;
          padding: 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }
        .custom-phone-input .PhoneInputInput {
          background: transparent !important;
          border: none !important;
          color: white !important;
          font-weight: 700;
        }
        .custom-phone-input .PhoneInputCountrySelect {
          background: #0a0a0a !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
};

export default CustomPhoneInput;
