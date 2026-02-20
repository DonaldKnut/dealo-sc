import React, { useState } from "react";
import Link from "next/link";

interface DropdownProps {
  isOpen: boolean;
  links: { href: string; label: string }[];
}

const Dropdown: React.FC<DropdownProps> = ({ isOpen, links }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute bg-gray-800 text-white rounded-lg shadow-md mt-2 z-50 w-48">
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.href}
          className="block px-4 py-2 hover:bg-green-600"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};

const NavLinks: React.FC = () => {
  const [isEducationDropdownOpen, setIsEducationDropdownOpen] = useState(false);
  const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false);
  const [isTravelDropdownOpen, setIsTravelDropdownOpen] = useState(false);

  // Toggle function with correct typing for the state setter
  const toggleDropdown = (
    dropdownSetter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    dropdownSetter((prev) => !prev);
  };

  return (
    <div className="flex items-center space-x-6">
      {/* Education Dropdown */}
      <div className="relative group">
        <button
          className="text-white hover:text-green-400"
          onClick={() => toggleDropdown(setIsEducationDropdownOpen)}
        >
          Education
        </button>
        <Dropdown
          isOpen={isEducationDropdownOpen}
          links={[
            { href: "/education/webinars", label: "Webinars" },
            { href: "/education/articles", label: "Articles" },
          ]}
        />
      </div>

      {/* Network Dropdown */}
      <div className="relative group">
        <button
          className="text-white hover:text-green-400"
          onClick={() => toggleDropdown(setIsNetworkDropdownOpen)}
        >
          Network
        </button>
        <Dropdown
          isOpen={isNetworkDropdownOpen}
          links={[
            { href: "/network/partners", label: "Partners" },
            { href: "/network/events", label: "Events" },
          ]}
        />
      </div>

      {/* Dealo Travels Dropdown */}
      <div className="relative group">
        <button
          className="text-white hover:text-green-400"
          onClick={() => toggleDropdown(setIsTravelDropdownOpen)}
        >
          Dealo Travels
        </button>
        <Dropdown
          isOpen={isTravelDropdownOpen}
          links={[
            { href: "/explore/packages", label: "Packages" },
            { href: "/explore/destinations", label: "Destinations" },
          ]}
        />
      </div>
    </div>
  );
};

export default NavLinks;
