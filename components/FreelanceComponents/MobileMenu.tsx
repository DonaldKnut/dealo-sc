import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Importing Next.js Image component
import { LuChevronDownCircle } from "react-icons/lu";

const MobileMenu: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (menuItem: string) => {
    setActiveDropdown(activeDropdown === menuItem ? null : menuItem);
  };

  return (
    <div className="bg-gradient-to-b from-[#323e33]/70 to-[#323232]/50 backdrop-blur-md text-white md:hidden z-40">
      <div className="flex flex-col items-center py-4 space-y-4 w-[85%] m-auto">
        {/* Education Menu */}
        <DropdownItem
          label="Education"
          menuItems={[
            {
              href: "/dealoforge",
              label: "Dealoforge",
              icon: "/dealoforge_icon.png", // Replace with your image path
            },
            {
              href: "/explore",
              label: "Travel Loans",
              icon: "/traveloan-img.png", // Replace with your image path
            },
          ]}
          activeDropdown={activeDropdown}
          toggleDropdown={toggleDropdown}
        />

        {/* Freelance Menu */}
        <DropdownItem
          label="Freelance"
          menuItems={[
            {
              href: "/marketplace",
              label: "Marketplace",
              icon: "/marketplace.png", // Replace with your image path
            },
            {
              href: "/video-chat",
              label: "Video Chat",
              icon: "/video-chat.png", // Replace with your image path
            },
          ]}
          activeDropdown={activeDropdown}
          toggleDropdown={toggleDropdown}
        />
      </div>
    </div>
  );
};

interface DropdownItemProps {
  label: string;
  menuItems: { href: string; label: string; icon: string }[]; // icon is now a string path for the image
  activeDropdown: string | null;
  toggleDropdown: (menuItem: string) => void;
}

const DropdownItem: React.FC<DropdownItemProps> = ({
  label,
  menuItems,
  activeDropdown,
  toggleDropdown,
}) => (
  <>
    <button
      className="flex items-center justify-between w-full px-4 py-2 text-left hover:text-green-400"
      onClick={() => toggleDropdown(label)}
    >
      <span>{label}</span>
      <LuChevronDownCircle
        className={`transition-transform duration-300 ${
          activeDropdown === label ? "rotate-180" : ""
        }`}
      />
    </button>
    {activeDropdown === label && (
      <div className="w-full pl-8 flex flex-col space-y-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex items-center space-x-3 hover:text-gray-400"
          >
            <Image
              src={item.icon} // Next.js Image for the icon
              alt={`${item.label} icon`}
              width={42}
              height={42}
              // className="rounded-[22px] p-3 bg-[#4bb381]"
            />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    )}
  </>
);

export default MobileMenu;
