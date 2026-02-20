"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  avatar?: string; // URL to the avatar
  status?: string; // ONLINE, OFFLINE, etc.
}

interface AvatarProps {
  user?: User;
}

const DEFAULT_IMAGE = "/user.png"; // Path to your default avatar image

const Avatar: React.FC<AvatarProps> = ({ user }) => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        if (user?.id) {
          const response = await axios.get(`/api/users/${user.id}/status`);
          setIsOnline(response.data.status === "ONLINE");
        }
      } catch (error) {
        console.error("Failed to fetch user status:", error);
      }
    };

    fetchStatus();
  }, [user?.id]);

  const avatarUrl = user?.avatar || DEFAULT_IMAGE;
  const fallbackText = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email.charAt(0).toUpperCase() || "U";

  return (
    <div className="relative inline-block h-9 w-9 md:h-11 md:w-11">
      {/* Avatar image or fallback text */}
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={user?.name || user?.email || "User Avatar"}
          layout="fill"
          objectFit="cover"
          className="rounded-full bg-gray-200"
        />
      ) : (
        <span className="flex items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600 h-full w-full">
          {fallbackText}
        </span>
      )}
      {/* Online status indicator */}
      {isOnline && (
        <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full md:h-4 md:w-4"></span>
      )}
    </div>
  );
};

export default Avatar;
