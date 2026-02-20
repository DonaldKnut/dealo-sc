"use client";

import React, { useState, useRef } from "react";
import { Sparkles } from "lucide-react";
import CoverPhoto from "./CoverPhoto";
import ProfilePicture from "./ProfilePicture";
import EditableField from "./EditableField";
import MetricsGrid from "./MetricsGrid";
import Link from "next/link";

const defaultAvatar = "/360_F_931099279_sRyaUJzHN88LyH93npATl5FdWbkpBF0k.jpg";
const defaultCoverPhoto = "/360_F_931099279_sRyaUJzHN88LyH93npATl5FdWbkpBF0k.jpg";

interface ProfileCardProps {
  userId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  location?: string;
  skills?: string[];
  avatar?: string;
  coverPhoto?: string;
  credits?: number;
  jobs?: number;
  orders?: number;
  bids?: number;
  wishlist?: number;
  cartItems?: number;
  status?: string;
}

const inputClass =
  "w-full max-w-xs rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 outline-none transition-all";

const ProfileCard: React.FC<ProfileCardProps> = ({
  userId,
  firstName,
  lastName,
  email,
  role = "User Role",
  location,
  skills = [],
  avatar,
  coverPhoto,
  credits = 0,
  jobs = 0,
  orders = 0,
  bids = 0,
  wishlist = 0,
  cartItems = 0,
  status = "OFFLINE",
}) => {
  const [profileImage, setProfileImage] = useState<string>(avatar || defaultAvatar);
  const [coverImage, setCoverImage] = useState<string>(coverPhoto || defaultCoverPhoto);
  const [editField, setEditField] = useState<string | null>(null);
  const [editableValues, setEditableValues] = useState({
    firstName: firstName || "",
    lastName: lastName || "",
    email: email || "",
    location: location || "",
    skills,
  });

  const coverFileInputRef = useRef<HTMLInputElement | null>(null);
  const profileFileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState<"avatar" | "cover" | null>(null);

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setUploading("avatar");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("prefix", "avatars");
      const res = await fetch("/api/uploads/r2", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      if (!json?.url) throw new Error("Invalid upload response");
      setProfileImage(json.url);
      const updateRes = await fetch(`/api/chats/users/${userId}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileImage: json.url }),
      });
      if (!updateRes.ok) console.error("Failed to update profile image in database");
    } catch (error: any) {
      console.error("Error uploading profile image:", error);
      alert(error.message || "Failed to upload profile image");
    } finally {
      setUploading(null);
    }
  };

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setUploading("cover");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("prefix", "covers");
      const res = await fetch("/api/uploads/r2", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      if (!json?.url) throw new Error("Invalid upload response");
      setCoverImage(json.url);
      const updateRes = await fetch(`/api/chats/users/${userId}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverPhoto: json.url }),
      });
      if (!updateRes.ok) console.error("Failed to update cover photo in database");
    } catch (error: any) {
      console.error("Error uploading cover photo:", error);
      alert(error.message || "Failed to upload cover photo");
    } finally {
      setUploading(null);
    }
  };

  const handleSave = (field: string) => {
    setEditField(null);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl">
      <CoverPhoto
        coverImage={coverImage}
        onFileChange={handleCoverImageUpload}
        coverFileInputRef={coverFileInputRef}
        uploading={uploading === "cover"}
      />

      <div className="px-6 sm:px-8 pt-4 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end gap-6">
          <ProfilePicture
            profileImage={profileImage}
            onFileChange={handleProfileImageUpload}
            profileFileInputRef={profileFileInputRef}
            userId={userId}
            loggedInUserId={userId}
            uploading={uploading === "avatar"}
          />
          <div className="flex-1 min-w-0 sm:pb-1">
            <EditableField
              label="Name"
              value={`${editableValues.firstName} ${editableValues.lastName}`}
              editField={editField}
              currentField="name"
              setEditField={setEditField}
              onSave={() => handleSave("name")}
            >
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  value={editableValues.firstName}
                  onChange={(e) =>
                    setEditableValues((prev) => ({ ...prev, firstName: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="First name"
                />
                <input
                  type="text"
                  value={editableValues.lastName}
                  onChange={(e) =>
                    setEditableValues((prev) => ({ ...prev, lastName: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="Last name"
                />
              </div>
            </EditableField>
            <p className="text-sm font-semibold text-emerald-400/90 mt-0.5">{role}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-1">
              Status: {status}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5">
          <EditableField
            label="Location"
            value={editableValues.location || "Not set"}
            editField={editField}
            currentField="location"
            setEditField={setEditField}
            onSave={() => handleSave("location")}
          >
            <input
              type="text"
              value={editableValues.location}
              onChange={(e) =>
                setEditableValues((prev) => ({ ...prev, location: e.target.value }))
              }
              className={inputClass}
              placeholder="City, Country"
            />
          </EditableField>
          <EditableField
            label="Email"
            value={editableValues.email || "—"}
            editField={editField}
            currentField="email"
            setEditField={setEditField}
            onSave={() => handleSave("email")}
          >
            <input
              type="email"
              value={editableValues.email}
              onChange={(e) =>
                setEditableValues((prev) => ({ ...prev, email: e.target.value }))
              }
              className={inputClass}
              placeholder="you@example.com"
            />
          </EditableField>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/50">
              Metrics
            </h3>
            <Link
              href="/dealoforge/dashboard"
              className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Dashboard
            </Link>
          </div>
          <MetricsGrid
            credits={credits}
            jobs={jobs}
            orders={orders}
            bids={bids}
            wishlist={wishlist}
            cartItems={cartItems}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
