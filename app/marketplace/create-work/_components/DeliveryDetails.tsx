// src/components/forms/DeliveryDetails.tsx
import React from "react";
import { Calendar, Clock } from "lucide-react";

interface DeliveryDetailsProps {
  register: any;
  errors: any;
}

const DeliveryDetails: React.FC<DeliveryDetailsProps> = ({
  register,
  errors,
}) => {
  return (
    <div className="flex gap-4">
      <div>
        <label
          htmlFor="deliveryDate"
          className="font-semibold text-gray-700 flex items-center gap-2"
        >
          <Calendar size={20} className="text-green-600" />
          Delivery Date
        </label>
        <input
          type="date"
          {...register("deliveryDate")}
          className={`w-full border p-4 rounded-lg ${
            errors.deliveryDate ? "border-red-500" : "focus:ring-green-600"
          }`}
        />
        {errors.deliveryDate && (
          <p className="text-red-500">{errors.deliveryDate.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="deliveryTime"
          className="font-semibold text-gray-700 flex items-center gap-2"
        >
          <Clock size={20} className="text-green-600" />
          Delivery Time
        </label>
        <input
          type="time"
          {...register("deliveryTime")}
          className={`w-full border p-4 rounded-lg ${
            errors.deliveryTime ? "border-red-500" : "focus:ring-green-600"
          }`}
        />
        {errors.deliveryTime && (
          <p className="text-red-500">{errors.deliveryTime.message}</p>
        )}
      </div>
    </div>
  );
};

export default DeliveryDetails;
