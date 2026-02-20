"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Phone,
  Video,
  Users,
  Settings,
  ArrowLeft,
  Copy,
  Share,
} from "lucide-react";
import VideoCallInterface from "@/components/video/VideoCallInterface";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

// Component that uses useSearchParams
const VideoCallContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate or get room ID from URL
    const urlRoomId = searchParams.get("room");
    if (urlRoomId) {
      setRoomId(urlRoomId);
    } else {
      // Generate a random room ID
      const generatedRoomId = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
      setRoomId(generatedRoomId);
    }
  }, [searchParams]);

  const copyRoomLink = async () => {
    const roomLink = `${window.location.origin}/video-call?room=${roomId}`;
    try {
      await navigator.clipboard.writeText(roomLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy room link:", error);
    }
  };

  const shareRoom = async () => {
    const roomLink = `${window.location.origin}/video-call?room=${roomId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my video call",
          text: "Click the link to join my video call on Dealo",
          url: roomLink,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      copyRoomLink();
    }
  };

  const startCall = () => {
    setIsCallStarted(true);
  };

  const leaveCall = () => {
    setIsCallStarted(false);
    router.push("/dashboard");
  };

  if (isCallStarted) {
    return <VideoCallInterface roomId={roomId} onLeave={leaveCall} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Video Call</h1>
          <p className="text-gray-300">
            Start or join a high-quality video call
          </p>
        </motion.div>

        {/* Room Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20"
        >
          {/* Room ID */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Room Code
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white/10 rounded-lg px-4 py-3">
                <span className="text-white font-mono text-lg tracking-wider">
                  {roomId}
                </span>
              </div>
              <button
                onClick={copyRoomLink}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Share Options */}
          <div className="mb-8">
            <h3 className="text-white font-semibold mb-3">Share Room</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={shareRoom}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Share className="w-4 h-4" />
                Share Link
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(roomId)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy Room Code
              </button>
            </div>
          </div>

          {/* Call Features */}
          <div className="mb-8">
            <h3 className="text-white font-semibold mb-3">Call Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <Video className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-white text-sm font-medium">HD Video</p>
                <p className="text-gray-400 text-xs">Up to 1080p</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-white text-sm font-medium">Multi-Party</p>
                <p className="text-gray-400 text-xs">Unlimited participants</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <Settings className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-white text-sm font-medium">Screen Share</p>
                <p className="text-gray-400 text-xs">Present & collaborate</p>
              </div>
            </div>
          </div>

          {/* Start Call Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startCall}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
          >
            <Phone className="w-6 h-6" />
            Start Video Call
          </motion.button>

          {/* Info */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Share the room code with others to invite them to join
            </p>
          </div>
        </motion.div>

        {/* Quality Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white text-sm">
              High-quality WebRTC connection
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Main component with Suspense wrapper
const VideoCallPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
          <div className="text-white text-lg">Loading video call...</div>
        </div>
      }
    >
      <VideoCallContent />
    </Suspense>
  );
};

export default VideoCallPage;
