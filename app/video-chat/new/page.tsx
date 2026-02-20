"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Copy,
  Check,
  ArrowLeft,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Users,
  Link2,
  Shield,
} from "lucide-react";

const NewMeetingPage = () => {
  const router = useRouter();
  const [meetingId] = useState(() => crypto.randomUUID().slice(0, 12));
  const [meetingTitle, setMeetingTitle] = useState("");
  const [copied, setCopied] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const meetingLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/video-chat/room/${meetingId}`
      : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(meetingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStart = () => {
    setIsCreating(true);
    setTimeout(() => {
      router.push(`/video-chat/room/${meetingId}`);
    }, 600);
  };

  return (
    <div className="p-6 lg:p-10 max-w-3xl">
      {/* Back */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push("/video-chat")}
        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </motion.button>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white mb-2">New Meeting</h1>
        <p className="text-sm text-gray-500">
          Set up your meeting and invite participants
        </p>
      </motion.div>

      {/* Meeting Setup Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden"
      >
        {/* Preview area */}
        <div className="relative bg-gradient-to-br from-black/60 to-black/40 h-56 flex items-center justify-center border-b border-white/[0.06]">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-sm text-gray-400">Camera preview</p>
          </div>

          {/* Media controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                micOn
                  ? "bg-white/10 text-white hover:bg-white/15"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {micOn ? (
                <Mic className="w-4 h-4" />
              ) : (
                <MicOff className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => setCameraOn(!cameraOn)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                cameraOn
                  ? "bg-white/10 text-white hover:bg-white/15"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {cameraOn ? (
                <Camera className="w-4 h-4" />
              ) : (
                <CameraOff className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Meeting details */}
        <div className="p-6 space-y-5">
          {/* Title input */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2 block">
              Meeting Title (optional)
            </label>
            <input
              type="text"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              placeholder="e.g. Client Discovery Call"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-green-500/40 focus:border-green-500/30 transition-all"
            />
          </div>

          {/* Meeting link */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2 block">
              Meeting Link
            </label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3">
                <Link2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm text-gray-400 truncate">
                  {meetingLink}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white hover:bg-white/[0.08] transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Info badges */}
          <div className="flex flex-wrap gap-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Shield className="w-3.5 h-3.5 text-green-500/60" />
              End-to-end encrypted
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Users className="w-3.5 h-3.5 text-green-500/60" />
              Up to 50 participants
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleStart}
              disabled={isCreating}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-medium py-3 rounded-lg hover:from-emerald-400 hover:to-green-500 transition-all shadow-lg shadow-green-500/20 disabled:opacity-60"
            >
              {isCreating ? "Starting..." : "Start Meeting"}
            </button>
            <button
              onClick={handleCopy}
              className="px-5 py-3 text-sm text-gray-400 bg-white/[0.04] border border-white/[0.08] rounded-lg hover:bg-white/[0.08] hover:text-white transition-all"
            >
              Copy Link
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NewMeetingPage;
