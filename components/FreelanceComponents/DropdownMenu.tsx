import React, { useState } from "react";
import Image from "next/image";

interface DropdownMenuProps {
  label: string;
  imageSrc: string;
  description: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  label,
  imageSrc,
  description,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div className="relative">
      <span
        className="text-white hover:text-green-300 cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {label}
      </span>
      {isHovered && (
        <div
          className="absolute left-0 mt-2 w-64 bg-green-800 text-white rounded-lg shadow-lg p-4 transition-opacity duration-300 ease-in-out"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center space-x-4">
            <Image
              src={imageSrc}
              alt={label}
              width={50}
              height={50}
              className="rounded-lg"
            />
            <span>{description}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
