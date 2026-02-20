import React from "react";

const SectionHeader: React.FC<{ title: string; icon: React.ReactNode }> = ({
  title,
  icon,
}) => (
  <div className="flex items-center mb-2">
    <div className="w-10 h-10 flex items-center justify-center bg-green-200 rounded-full">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-green-800 ml-2">{title}</h3>
  </div>
);

export default SectionHeader;
