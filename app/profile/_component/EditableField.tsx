"use client";

import React, { useState } from "react";
import { Pencil, Check } from "lucide-react";

interface EditableFieldProps {
  label: string;
  value: string;
  editField: string | null;
  currentField: string;
  setEditField: React.Dispatch<React.SetStateAction<string | null>>;
  onSave: () => void;
  userId?: string;
  loggedInUserId?: string;
  children: React.ReactNode;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  editField,
  currentField,
  setEditField,
  onSave,
  userId,
  loggedInUserId,
  children,
}) => {
  const [requestSent, setRequestSent] = useState(false);

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

  const isEditing = editField === currentField;
  const showConnect = userId && loggedInUserId && userId !== loggedInUserId && !requestSent;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 border-b border-white/5 last:border-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex-shrink-0">
          {label}
        </span>
        {isEditing ? (
          <div className="flex flex-wrap items-center gap-2">
            {children}
            <button
              onClick={onSave}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              Save
            </button>
          </div>
        ) : (
          <span className="text-white/90 font-medium truncate">{value}</span>
        )}
      </div>
      {!isEditing && (
        <div className="flex items-center gap-3 flex-shrink-0">
          {showConnect && (
            <button
              onClick={handleConnect}
              className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/30 transition-colors"
            >
              Connect
            </button>
          )}
          {userId && loggedInUserId && userId !== loggedInUserId && requestSent && (
            <span className="text-emerald-400/80 text-xs font-medium">Request sent</span>
          )}
          <button
            onClick={() => setEditField(currentField)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableField;
