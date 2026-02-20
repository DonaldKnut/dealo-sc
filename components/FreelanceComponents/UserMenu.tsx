import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LuChevronDownCircle } from "react-icons/lu";
import { signOut } from "next-auth/react";

interface UserMenuProps {
  currentUser: { firstName: string; isLoggedIn: boolean };
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      window.location.href = "/sign-in";
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.href = "/sign-in";
    }
  };

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-2 text-white"
        onClick={toggleUserDropdown}
      >
        <Image
          src="/user.png"
          alt="User"
          className="rounded-full"
          width={30}
          height={30}
        />
        <span>{currentUser.isLoggedIn ? currentUser.firstName : "Guest"}</span>
        <LuChevronDownCircle className="ml-2 text-lg" />
      </button>

      {isUserDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-green-800 text-white shadow-md rounded-lg py-2 z-10">
          {currentUser.isLoggedIn ? (
            <>
              <Link
                href="/mygigs"
                className="block px-4 py-2 hover:bg-green-600"
              >
                Gigs
              </Link>
              <Link href="/add" className="block px-4 py-2 hover:bg-green-600">
                Add New Gigs
              </Link>
              <Link
                href="/orders"
                className="block px-4 py-2 hover:bg-green-600"
              >
                Orders
              </Link>
              <Link
                href="/messages"
                className="block px-4 py-2 hover:bg-green-600"
              >
                Messages
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-green-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/sign-in"
              className="block px-4 py-2 hover:bg-green-600"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
