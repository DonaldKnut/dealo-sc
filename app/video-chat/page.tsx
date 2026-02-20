"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Users,
  Shield,
  Zap,
  Plus,
  Link2,
  CalendarPlus,
  Play,
  ArrowRight,
  Clock,
  Calendar,
  Copy,
  Check,
  X,
} from "lucide-react";

const VideoChatHome = () => {
  const router = useRouter();
  const [meetingLink, setMeetingLink] = useState("");
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [showNewMeetingPanel, setShowNewMeetingPanel] = useState(false);

  const now = new Date();
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(
    now
  );

  const features = [
    { icon: Shield, label: "Encrypted" },
    { icon: Users, label: "Up to 50" },
    { icon: Zap, label: "No downloads" },
  ];

  const handleNewMeeting = () => {
    const meetingId = crypto.randomUUID().slice(0, 12);
    const link = `${window.location.origin}/video-chat/room/${meetingId}`;
    setGeneratedLink(link);
    setShowNewMeetingPanel(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const actions = [
    {
      icon: Plus,
      label: "New Meeting",
      description: "Start an instant video call",
      gradient: "from-emerald-500 to-green-600",
      glow: "shadow-emerald-500/20",
      onClick: handleNewMeeting,
    },
    {
      icon: Link2,
      label: "Join Meeting",
      description: "Enter with a meeting link",
      gradient: "from-green-400 to-emerald-600",
      glow: "shadow-green-500/20",
      onClick: () => setShowJoinInput(true),
    },
    {
      icon: CalendarPlus,
      label: "Schedule",
      description: "Plan a future meeting",
      gradient: "from-teal-500 to-green-600",
      glow: "shadow-teal-500/20",
      onClick: () => router.push("/video-chat/scheduled"),
    },
    {
      icon: Play,
      label: "Recordings",
      description: "View past recordings",
      gradient: "from-green-600 to-emerald-700",
      glow: "shadow-green-600/20",
      onClick: () => router.push("/video-chat/recordings"),
    },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-5xl">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-green-600/90 via-green-700/90 to-emerald-800/90 border border-green-500/20"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/[0.05] rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-white/[0.04] rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 p-8 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 mb-6"
          >
            <Clock className="w-3.5 h-3.5 text-green-200" />
            <span className="text-xs text-green-100 font-medium">
              {time} &middot; {date}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-4"
          >
            Have Meetings with{" "}
            <span className="bg-gradient-to-r from-green-200 to-white bg-clip-text text-transparent">
              Clients
            </span>{" "}
            or{" "}
            <span className="bg-gradient-to-r from-green-200 to-white bg-clip-text text-transparent">
              Prospective Clients
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-base lg:text-lg text-green-100/80 max-w-xl mb-6 leading-relaxed"
          >
            Connect face-to-face, conduct interviews, and build meaningful
            relationships through professional video conferencing.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-2"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 + i * 0.08 }}
                className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5"
              >
                <f.icon className="w-3.5 h-3.5 text-green-200" />
                <span className="text-xs text-green-100 font-medium">
                  {f.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4"
        >
          Quick Actions
        </motion.h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {actions.map((action, i) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.08, duration: 0.4 }}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={action.onClick}
              className={`relative group bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 text-left hover:border-green-500/20 hover:bg-white/[0.05] hover:shadow-xl ${action.glow} transition-all duration-200`}
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}
              >
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-green-300 transition-colors">
                {action.label}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {action.description}
              </p>
              <ArrowRight className="absolute top-5 right-4 w-4 h-4 text-green-500/0 group-hover:text-green-400 group-hover:translate-x-0.5 transition-all duration-200" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* New Meeting Panel */}
      <AnimatePresence>
        {showNewMeetingPanel && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="bg-white/[0.04] border border-green-500/15 rounded-xl p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                  <Video className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Meeting Ready
                  </h3>
                  <p className="text-xs text-gray-500">
                    Share the link or join now
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNewMeetingPanel(false)}
                className="text-gray-500 hover:text-white transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <div className="flex-1 bg-white/[0.06] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-300 truncate">
                {generatedLink}
              </div>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 bg-white/[0.06] border border-white/10 text-sm text-white px-4 py-2.5 rounded-lg hover:bg-white/[0.1] transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  router.push(generatedLink.replace(window.location.origin, ""))
                }
                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-medium py-2.5 rounded-lg hover:from-emerald-400 hover:to-green-500 transition-all shadow-lg shadow-green-500/20"
              >
                Start Now
              </button>
              <button
                onClick={() => setShowNewMeetingPanel(false)}
                className="px-5 py-2.5 text-sm text-gray-400 hover:text-white bg-white/[0.04] border border-white/[0.08] rounded-lg hover:bg-white/[0.08] transition-all"
              >
                Later
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Join Meeting Input */}
      <AnimatePresence>
        {showJoinInput && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="bg-white/[0.04] border border-green-500/15 rounded-xl p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">
                Join a Meeting
              </h3>
              <button
                onClick={() => {
                  setShowJoinInput(false);
                  setMeetingLink("");
                }}
                className="text-gray-500 hover:text-white transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="Paste meeting link or code..."
                className="flex-1 bg-white/[0.06] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500/40 focus:border-green-500/40 transition-all"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && meetingLink.trim())
                    router.push(meetingLink.trim());
                }}
              />
              <button
                onClick={() => {
                  if (meetingLink.trim()) router.push(meetingLink.trim());
                }}
                className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:from-emerald-400 hover:to-green-500 transition-all shadow-lg shadow-green-500/20 disabled:opacity-40"
                disabled={!meetingLink.trim()}
              >
                Join
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upcoming Meetings */}
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-between mb-4"
        >
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Upcoming Meetings
          </h2>
          <button
            onClick={() => router.push("/video-chat/scheduled")}
            className="text-xs text-green-500 hover:text-green-400 transition-colors flex items-center gap-1"
          >
            View all <ArrowRight className="w-3 h-3" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-10 flex flex-col items-center justify-center text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/10 flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-green-600/60" />
          </div>
          <p className="text-sm text-gray-400 mb-1 font-medium">
            No upcoming meetings
          </p>
          <p className="text-xs text-gray-600 mb-5">
            Schedule a meeting to see it here
          </p>
          <button
            onClick={() => router.push("/video-chat/scheduled")}
            className="text-xs text-green-400 border border-green-500/20 bg-green-500/[0.06] px-4 py-2 rounded-lg hover:bg-green-500/[0.12] transition-colors"
          >
            Schedule Meeting
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default VideoChatHome;
