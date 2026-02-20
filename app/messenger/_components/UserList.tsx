"use client";

import React, { useState } from "react";
import UserBox from "./UserBox";
import { Users as UsersIcon } from "lucide-react"; // Using an icon from lucide-react

type IUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  credits: number;
};

type Props = {
  items: IUser[];
};

const UserList: React.FC<Props> = ({ items }) => {
  const [openDropdownUserId, setOpenDropdownUserId] = useState<string | null>(
    null
  );

  // Toggle dropdown visibility for a specific user
  const handleToggleDropdown = (userId: string) => {
    setOpenDropdownUserId((prev) => (prev === userId ? null : userId));
  };

  return (
    <aside className="fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto w-full">
      <div className="text-2xl font-bold text-neutral py-4 flex items-center space-x-2">
        <UsersIcon className="text-green-300 ml-3" size={24} />
        <h2 className="text-green-500 ml-4">People</h2>
      </div>
      <div className="space-y-4">
        {items.map((user) => (
          <UserBox
            key={user._id}
            user={user}
            isOpen={openDropdownUserId === user._id}
            onToggleDropdown={() => handleToggleDropdown(user._id)}
          />
        ))}
      </div>
    </aside>
  );
};

export default UserList;
