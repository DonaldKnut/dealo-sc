import React from "react";
import { Controller } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface CustomPhoneInputProps {
  name: string;
  control: any;
  errors: any;
  trigger: any;
}

const CustomPhoneInput: React.FC<CustomPhoneInputProps> = ({
  name,
  control,
  errors,
  trigger,
}) => {
  return (
    <div>
      <label htmlFor={name} className="block text-[#65a363] mb-1">
        Phone Number
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <PhoneInput
            {...field}
            international
            defaultCountry="NG" // Replace 'NG' with your desired default country code
            onChange={(value) => {
              field.onChange(value);
              trigger(name);
            }}
            className="w-full px-4 py-2 border border-[#65a363] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-gray-800"
          />
        )}
      />
      {errors[name]?.message && (
        <span className="text-red-500 text-sm">
          {typeof errors[name].message === "string" ? errors[name].message : ""}
        </span>
      )}
    </div>
  );
};

export default CustomPhoneInput;
