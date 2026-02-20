"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Pencil, Loader2 } from "lucide-react";

interface ProfilePictureProps {
  profileImage: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  profileFileInputRef: React.RefObject<HTMLInputElement>;
  userId: string | undefined;
  loggedInUserId?: string;
  uploading?: boolean;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  profileImage,
  onFileChange,
  profileFileInputRef,
  userId,
  loggedInUserId,
  uploading = false,
}) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleConnect = async () => {
    try {
      const response = await fetch("/api/friend-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: userId, action: "send" }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setRequestSent(true);
      alert("Connection request sent successfully!");
    } catch (error: any) {
      console.error("Error sending request:", error);
      alert(error.message || "Failed to send request.");
    }
  };

  if (loading) {
    return (
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 -mt-12 sm:-mt-14 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
    );
  }

  return (
    <div className="relative w-24 h-24 sm:w-28 sm:h-28 -mt-12 sm:-mt-14 flex-shrink-0">
      <div className="absolute inset-0 rounded-2xl p-[3px] bg-gradient-to-br from-emerald-500/40 to-green-600/30 rounded-2xl">
        <div className="w-full h-full rounded-[10px] overflow-hidden bg-black/80 border border-white/10">
          <Image
            src={profileImage}
            alt="Profile"
            width={112}
            height={112}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      {uploading && (
        <div className="absolute inset-0 rounded-2xl bg-black/60 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
        </div>
      )}
      <button
        onClick={() => profileFileInputRef.current?.click()}
        disabled={uploading}
        className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-black/80 backdrop-blur border border-white/10 text-white/90 hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:text-emerald-400 transition-all disabled:opacity-50"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <input
        type="file"
        ref={profileFileInputRef}
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
        disabled={uploading}
      />
      {userId && user && loggedInUserId && userId !== loggedInUserId && (
        <>
          {!requestSent && (
            <button
              onClick={handleConnect}
              className="mt-3 w-full py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/30 transition-colors"
            >
              Connect
            </button>
          )}
          {requestSent && (
            <p className="mt-3 text-emerald-400/80 text-xs font-medium text-center">Request sent</p>
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePicture;
