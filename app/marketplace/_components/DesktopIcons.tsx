import React, { useState } from "react";
import { MdPerson } from "react-icons/md";
import Image from "next/image";
import UserMenu from "./UserMenu";

type DesktopIconsProps = {
  user: any;
  setMobileMenu: (open: boolean) => void;
  handleLogout: () => void;
};

const DesktopIcons = ({
  user,
  setMobileMenu,
  handleLogout,
}: DesktopIconsProps) => {
  const [dropdownMenu, setDropdownMenu] = useState(false);

  return (
    <div className="hidden lg:flex items-center gap-4">
      <button
        className={`flex items-center gap-2 ${
          dropdownMenu ? "rotate-180" : ""
        } transition-transform`}
        onClick={() => setDropdownMenu(!dropdownMenu)}
      >
        {user?.avatar ? (
          <Image
            src={user.avatar.url}
            alt="profile"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <MdPerson size={44} className="text-white" />
        )}
      </button>

      {dropdownMenu && <UserMenu user={user} handleLogout={handleLogout} />}
    </div>
  );
};

export default DesktopIcons;
