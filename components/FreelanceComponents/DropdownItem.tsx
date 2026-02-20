import React from "react";
import Image from "next/image";

interface DropdownItemProps {
  title: string;
  description: string;
  imageUrl: string;
  href: string;
}

const DropdownItem: React.FC<DropdownItemProps> = ({
  title,
  description,
  imageUrl,
  href,
}) => {
  return (
    <a
      href={href}
      className="flex items-center space-x-4 hover:bg-light-200 p-2 rounded-lg z-[1000]"
    >
      <Image
        src={imageUrl}
        alt={title}
        className="w-16 h-16 object-cover rounded-lg"
      />
      <div>
        <h4 className="font-semibold text-green-600">{title}</h4>
        <p className="text-sm text-dark-600">{description}</p>
      </div>
    </a>
  );
};

export default DropdownItem;
