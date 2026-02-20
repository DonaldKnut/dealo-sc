import React from "react";
import Link from "next/link";

interface DropdownProps {
  title: string;
  links: { href: string; label: string }[];
  hoveredDropdown: string | null;
  handleMouseEnter: (dropdown: string) => void;
  handleMouseLeave: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  title,
  links,
  hoveredDropdown,
  handleMouseEnter,
  handleMouseLeave,
}) => {
  return (
    <div
      className="relative"
      onMouseEnter={() => handleMouseEnter(title)}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={`/${title.toLowerCase()}`}
        className="text-white hover:text-green-400"
      >
        {title}
      </Link>
      {hoveredDropdown === title && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-green-800 text-white shadow-md rounded-lg py-2 z-50">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-2 hover:bg-green-600"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
