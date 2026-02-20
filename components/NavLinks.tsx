import React, { useState } from "react";
import Link from "next/link";

interface NavLinksProps {
  currentUser: { firstName: string; isLoggedIn: boolean };
  setIsUserDropdownOpen: (open: boolean) => void;
  isUserDropdownOpen: boolean;
}

const NavLinks: React.FC<NavLinksProps> = ({
  currentUser,
  isUserDropdownOpen,
  setIsUserDropdownOpen,
}) => {
  const [isEducationDropdownOpen, setIsEducationDropdownOpen] = useState(false);
  const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false);
  const [isTravelDropdownOpen, setIsTravelDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
      {/* Education with Dropdown */}
      <div className="relative">
        <button
          className="text-white hover:text-green-400"
          onClick={() => setIsEducationDropdownOpen(!isEducationDropdownOpen)}
        >
          Education
        </button>
        {isEducationDropdownOpen && (
          <div className="absolute bg-gray-800 text-white rounded-lg shadow-md mt-2 z-10 w-48">
            <Link
              href="/education/webinars"
              className="block px-4 py-2 hover:bg-green-600"
            >
              Webinars
            </Link>
            <Link
              href="/education/articles"
              className="block px-4 py-2 hover:bg-green-600"
            >
              Articles
            </Link>
          </div>
        )}
      </div>

      {/* Network with Dropdown */}
      <div className="relative">
        <button
          className="text-white hover:text-green-400"
          onClick={() => setIsNetworkDropdownOpen(!isNetworkDropdownOpen)}
        >
          Network
        </button>
        {isNetworkDropdownOpen && (
          <div className="absolute bg-gray-800 text-white rounded-lg shadow-md mt-2 z-10 w-48">
            <Link
              href="/network/groups"
              className="block px-4 py-2 hover:bg-green-600"
            >
              Groups
            </Link>
            <Link
              href="/network/forums"
              className="block px-4 py-2 hover:bg-green-600"
            >
              Forums
            </Link>
            <Link
              href="/network/events"
              className="block px-4 py-2 hover:bg-green-600"
            >
              Events
            </Link>
          </div>
        )}
      </div>

      {/* Dealo Travels with Dropdown */}
      <div className="relative">
        <button
          className="text-white hover:text-green-400"
          onClick={() => setIsTravelDropdownOpen(!isTravelDropdownOpen)}
        >
          Dealo Travels
        </button>
        {isTravelDropdownOpen && (
          <div className="absolute bg-gray-800 text-white rounded-lg shadow-md mt-2 z-10 w-48">
            <Link
              href="/explore/tours"
              className="block px-4 py-2 hover:bg-green-600"
            >
              Tours
            </Link>
            <Link
              href="/explore/flights"
              className="block px-4 py-2 hover:bg-green-600"
            >
              Flights
            </Link>
            <Link
              href="/explore/hotels"
              className="block px-4 py-2 hover:bg-green-600"
            >
              Hotels
            </Link>
          </div>
        )}
      </div>

      {/* Other static links */}
      <Link href="/dealopay" className="text-white hover:text-green-400">
        Crypto
      </Link>
    </div>
  );
};

export default NavLinks;
