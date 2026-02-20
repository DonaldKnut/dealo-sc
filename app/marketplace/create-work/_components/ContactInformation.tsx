// src/components/forms/ContactInformation.tsx
import React from "react";
import { Mail } from "lucide-react";

interface ContactInformationProps {
  register: any;
  errors: {
    email?: { message: string };
    phone?: { message: string };
  };
}

const ContactInformation: React.FC<ContactInformationProps> = ({
  register,
  errors,
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <Mail size={20} className="text-green-600" />
        Contact Information
      </h3>
      <div className="flex gap-4">
        <div>
          <label htmlFor="email" className="font-semibold">
            Email
          </label>
          <input
            type="email"
            {...register("contactInformation.email")}
            className={`w-full border p-4 rounded-lg ${
              errors.email ? "border-red-500" : "focus:ring-green-600"
            }`}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className="font-semibold">
            Phone
          </label>
          <input
            type="text"
            {...register("contactInformation.phone")}
            className={`w-full border p-4 rounded-lg ${
              errors.phone ? "border-red-500" : "focus:ring-green-600"
            }`}
          />
          {errors.phone && (
            <p className="text-red-500">{errors.phone.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;
