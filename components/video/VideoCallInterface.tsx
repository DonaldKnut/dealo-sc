"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageSquare,
  Users,
  Settings,
  Share,
  Circle,
  MoreVertical,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Camera,
  CameraOff,
  Monitor,
  MonitorOff,
} from "lucide-react";

interface VideoCallInterfaceProps {
  roomId?: string;
  onLeave?: () => void;
}

const VideoCallInterface = ({
  roomId = "default-room",
  onLeave,
}: VideoCallInterfaceProps) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [participants, setParticipants] = useState(1);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState("excellent");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  // Initialize WebRTC connection
  const initializeCall = useCallback(async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
        ],
      });

      peerConnectionRef.current = peerConnection;

      // Add local stream to peer connection
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      // Handle incoming streams
      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
          remoteStreamRef.current = event.streams[0];
        }
      };

      // Monitor connection quality
      peerConnection.oniceconnectionstatechange = () => {
        const state = peerConnection.iceConnectionState;
        if (state === "connected" || state === "completed") {
          setConnectionQuality("excellent");
        } else if (state === "checking") {
          setConnectionQuality("connecting");
        } else {
          setConnectionQuality("poor");
        }
      };

      setIsCallActive(true);
    } catch (error) {
      console.error("Error initializing call:", error);
    }
  }, []);

  // Toggle microphone
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(!videoTrack.enabled);
      }
    }
  };

  // Screen sharing
  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });

        screenStreamRef.current = screenStream;
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = screenStream;
        }

        // Replace video track in peer connection
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = peerConnectionRef.current
          ?.getSenders()
          .find((s) => s.track?.kind === "video");
        if (sender) {
          sender.replaceTrack(videoTrack);
        }

        setIsScreenSharing(true);
      } else {
        // Stop screen sharing
        screenStreamRef.current?.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;

        // Restore camera video
        if (localStreamRef.current) {
          const videoTrack = localStreamRef.current.getVideoTracks()[0];
          const sender = peerConnectionRef.current
            ?.getSenders()
            .find((s) => s.track?.kind === "video");
          if (sender && videoTrack) {
            sender.replaceTrack(videoTrack);
          }
        }

        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error("Error toggling screen share:", error);
    }
  };

  // End call
  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    setIsCallActive(false);
    onLeave?.();
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    // Auto-start call when component mounts
    initializeCall();

    return () => {
      // Cleanup on unmount
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [initializeCall]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 z-50">
      {/* Main Video Area */}
      <div className="relative w-full h-full">
        {/* Remote Video (Main) */}
        <div className="absolute inset-0">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {!remoteStreamRef.current && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <p className="text-lg font-medium">
                  Waiting for participants...
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  Share this room code: {roomId}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 w-64 h-48 bg-black rounded-lg overflow-hidden shadow-2xl border-2 border-white/20"
        >
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!isVideoOn && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <CameraOff className="w-8 h-8 text-white" />
            </div>
          )}
        </motion.div>

        {/* Screen Share Overlay */}
        <AnimatePresence>
          {isScreenSharing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
            >
              <Monitor className="w-4 h-4" />
              Screen Sharing
            </motion.div>
          )}
        </AnimatePresence>

        {/* Connection Quality Indicator */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
              connectionQuality === "excellent"
                ? "bg-green-500 text-white"
                : connectionQuality === "connecting"
                ? "bg-yellow-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                connectionQuality === "excellent"
                  ? "bg-white"
                  : connectionQuality === "connecting"
                  ? "bg-white"
                  : "bg-white"
              }`}
            />
            {connectionQuality === "excellent"
              ? "Excellent"
              : connectionQuality === "connecting"
              ? "Connecting"
              : "Poor Connection"}
          </div>
        </div>

        {/* Control Bar */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="bg-black/80 backdrop-blur-xl rounded-full px-6 py-3 flex items-center gap-4 border border-white/20">
            {/* Mute Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMute}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isMuted
                  ? "bg-red-500 text-white"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {isMuted ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </motion.button>

            {/* Video Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleVideo}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                !isVideoOn
                  ? "bg-red-500 text-white"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {!isVideoOn ? (
                <VideoOff className="w-5 h-5" />
              ) : (
                <Video className="w-5 h-5" />
              )}
            </motion.button>

            {/* Screen Share Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleScreenShare}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isScreenSharing
                  ? "bg-green-500 text-white"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {isScreenSharing ? (
                <MonitorOff className="w-5 h-5" />
              ) : (
                <Monitor className="w-5 h-5" />
              )}
            </motion.button>

            {/* End Call Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={endCall}
              className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <PhoneOff className="w-6 h-6" />
            </motion.button>

            {/* Chat Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowChat(!showChat)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                showChat
                  ? "bg-blue-500 text-white"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
            </motion.button>

            {/* Participants Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowParticipants(!showParticipants)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                showParticipants
                  ? "bg-blue-500 text-white"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              <Users className="w-5 h-5" />
            </motion.button>

            {/* Fullscreen Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFullscreen}
              className="w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5" />
              ) : (
                <Maximize className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Chat Panel */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="absolute top-4 right-4 w-80 h-96 bg-black/90 backdrop-blur-xl rounded-lg border border-white/20 flex flex-col"
            >
              <div className="p-4 border-b border-white/20">
                <h3 className="text-white font-semibold">Chat</h3>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="text-gray-300 text-sm text-center">
                  Chat feature coming soon...
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Participants Panel */}
        <AnimatePresence>
          {showParticipants && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="absolute top-4 right-4 w-80 h-96 bg-black/90 backdrop-blur-xl rounded-lg border border-white/20 flex flex-col"
            >
              <div className="p-4 border-b border-white/20">
                <h3 className="text-white font-semibold">
                  Participants ({participants})
                </h3>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-white/10 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        You
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">You</p>
                      <p className="text-gray-300 text-xs">Host</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {!isMuted && <Mic className="w-3 h-3 text-green-400" />}
                      {isVideoOn && (
                        <Video className="w-3 h-3 text-green-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Screen Share Video (Hidden) */}
      <video ref={screenShareRef} autoPlay playsInline className="hidden" />
    </div>
  );
};

export default VideoCallInterface;
