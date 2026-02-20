// components/DetailItem.tsx
import React from "react";

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number | boolean;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3">
    <div className="text-green-600">{icon}</div>
    <p className="text-gray-700 font-semibold">{label}:</p>
    <p className="text-gray-600">{String(value)}</p>
  </div>
);

export default DetailItem;
