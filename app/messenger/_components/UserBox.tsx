"use client";

import React, { useCallback, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Avatar from "./Avatar";
import Modal from "./Modal";
import {
  User as LucideUser,
  Mail as LucideMail,
  Info as LucideInfo,
  Star as LucideStar,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";

interface UserBoxProps {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: string;
    credits: number;
  };
  isOpen: boolean;
  onToggleDropdown: () => void;
}

const UserBox: React.FC<UserBoxProps> = ({
  user,
  isOpen,
  onToggleDropdown,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConversation = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/conversations", {
        userId: user._id,
        isGroup: false,
        members: [{ value: user._id }],
      });
      router.push(`/conversations/${response.data.conversation._id}`);
    } catch (error) {
      console.error("Failed to start conversation:", error);
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, [user._id, router]);

  const emailDisplay =
    user.email.length > 20 ? (
      <span className="tooltip" title={user.email}>
        {user.email.substring(0, 20)}...
      </span>
    ) : (
      user.email
    );

  const statusColors: Record<string, string> = {
    ONLINE: "text-green-500",
    OFFLINE: "text-gray-500",
    BUSY: "text-red-500",
    AWAY: "text-yellow-500",
  };

  return (
    <div className="relative">
      <div
        className="flex items-center p-4 space-x-4 shadow-md hover:shadow-lg transition-all cursor-pointer backdrop-blur-md bg-opacity-75"
        onClick={onToggleDropdown}
      >
        <Avatar
          user={{
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
          }}
        />
        <div>
          <p className="text-lg font-semibold md:text-white text-green-500">
            {`${user.firstName} ${user.lastName}`}
          </p>
          <p className="text-sm text-gray-300">{emailDisplay}</p>
        </div>
      </div>

      {isOpen && (
        <div className="absolute right-5 mt-2 w-72 bg-[#1A1A1A] bg-opacity-80 border border-white border-opacity-30 rounded-xl shadow-xl backdrop-blur-lg z-50 md:bg-white md:bg-opacity-10 md:border-opacity-20">
          <ul className="py-3">
            <li
              className="flex items-center px-5 py-3 text-sm text-white hover:bg-green-700 hover:bg-opacity-20 rounded-lg cursor-pointer transition-all"
              onClick={handleConversation}
            >
              <MessageCircle className="mr-3" />
              <span>Start Conversation</span>
            </li>
            <li className="flex items-center px-5 py-3 text-sm text-white hover:bg-green-700 hover:bg-opacity-20 rounded-lg cursor-pointer transition-all">
              <LucideMail className="mr-3" />
              <span>{emailDisplay}</span>
            </li>
            <li className="flex items-center px-5 py-3 text-sm text-white hover:bg-green-700 hover:bg-opacity-20 rounded-lg cursor-pointer transition-all">
              <ShieldCheck className="mr-3" />
              <span>{user.role}</span>
            </li>
            <li className="flex items-center px-5 py-3 text-sm text-white hover:bg-green-700 hover:bg-opacity-20 rounded-lg cursor-pointer transition-all">
              <LucideStar className="mr-3" />
              <span>{user.credits} Credits</span>
            </li>
            <li className="flex items-center px-5 py-3 text-sm text-white hover:bg-green-700 hover:bg-opacity-20 rounded-lg cursor-pointer transition-all">
              <LucideInfo className={`mr-3 ${statusColors[user.status]}`} />
              <span>{user.status}</span>
            </li>
            <li className="flex items-center px-5 py-3 text-sm text-white hover:bg-green-700 hover:bg-opacity-20 rounded-lg cursor-pointer transition-all">
              <LucideUser className="mr-3" />
              <span>{`${user.firstName} ${user.lastName}`}</span>
            </li>
          </ul>
        </div>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-md shadow-xl text-center">
            <h2 className="text-xl font-bold text-green-500">
              Sign Up or Log In
            </h2>
            <p className="text-gray-300 mt-2">
              You need to be logged in to start a conversation.
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                onClick={() => router.push("/sign-in")}
              >
                Log In
              </button>
              <button
                className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800"
                onClick={() => router.push("/sign-up")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserBox;
