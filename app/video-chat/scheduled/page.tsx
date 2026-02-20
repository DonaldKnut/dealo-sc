"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Plus,
  Clock,
  Users,
  Video,
  Copy,
  Check,
  Trash2,
  X,
  Link2,
} from "lucide-react";

interface ScheduledMeeting {
  id: string;
  title: string;
  date: string;
  time: string;
  participants: number;
  link: string;
}

const ScheduledPage = () => {
  const router = useRouter();
  const [meetings, setMeetings] = useState<ScheduledMeeting[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    date: "",
    time: "",
  });

  const handleCreate = () => {
    if (!newMeeting.title || !newMeeting.date || !newMeeting.time) return;

    const id = crypto.randomUUID().slice(0, 12);
    const link =
      typeof window !== "undefined"
        ? `${window.location.origin}/video-chat/room/${id}`
        : "";

    setMeetings((prev) => [
      ...prev,
      {
        id,
        title: newMeeting.title,
        date: newMeeting.date,
        time: newMeeting.time,
        participants: 0,
        link,
      },
    ]);
    setNewMeeting({ title: "", date: "", time: "" });
    setShowCreateForm(false);
  };

  const handleDelete = (id: string) => {
    setMeetings((prev) => prev.filter((m) => m.id !== id));
  };

  const handleCopy = (id: string, link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push("/video-chat")}
        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Scheduled Meetings
          </h1>
          <p className="text-sm text-gray-500">
            Plan and manage your upcoming video calls
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:from-emerald-400 hover:to-green-500 transition-all shadow-lg shadow-green-500/20"
        >
          <Plus className="w-4 h-4" />
          Schedule
        </button>
      </motion.div>

      {/* Create Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="bg-white/[0.03] border border-green-500/15 rounded-xl p-6 mb-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-white">
                Schedule a Meeting
              </h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2 block">
                  Meeting Title
                </label>
                <input
                  type="text"
                  value={newMeeting.title}
                  onChange={(e) =>
                    setNewMeeting({ ...newMeeting, title: e.target.value })
                  }
                  placeholder="e.g. Weekly Team Sync"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-green-500/40 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2 block">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newMeeting.date}
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, date: e.target.value })
                    }
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-green-500/40 transition-all [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2 block">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newMeeting.time}
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, time: e.target.value })
                    }
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-green-500/40 transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleCreate}
                  disabled={
                    !newMeeting.title || !newMeeting.date || !newMeeting.time
                  }
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-medium py-3 rounded-lg hover:from-emerald-400 hover:to-green-500 transition-all shadow-lg shadow-green-500/20 disabled:opacity-40"
                >
                  Schedule Meeting
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-5 py-3 text-sm text-gray-400 bg-white/[0.04] border border-white/[0.08] rounded-lg hover:bg-white/[0.08] transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meeting List */}
      {meetings.length > 0 ? (
        <div className="space-y-3">
          {meetings.map((meeting, i) => (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 group hover:border-green-500/15 hover:bg-white/[0.04] transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/15 to-green-600/15 border border-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">
                      {meeting.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(meeting.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {meeting.time}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(meeting.id, meeting.link)}
                    className="p-2 text-gray-500 hover:text-white bg-white/[0.04] border border-white/[0.06] rounded-lg hover:bg-white/[0.08] transition-all"
                    title="Copy link"
                  >
                    {copiedId === meeting.id ? (
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() =>
                      router.push(
                        meeting.link.replace(window.location.origin, "")
                      )
                    }
                    className="px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg hover:from-emerald-400 hover:to-green-500 transition-all"
                  >
                    Join
                  </button>
                  <button
                    onClick={() => handleDelete(meeting.id)}
                    className="p-2 text-gray-600 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-12 flex flex-col items-center justify-center text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500/10 to-green-600/10 border border-green-500/10 flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-green-600/60" />
          </div>
          <p className="text-sm text-gray-400 mb-1 font-medium">
            No scheduled meetings
          </p>
          <p className="text-xs text-gray-600 mb-5">
            Create a scheduled meeting to plan ahead
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="text-xs text-green-400 border border-green-500/20 bg-green-500/[0.06] px-4 py-2 rounded-lg hover:bg-green-500/[0.12] transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Schedule Meeting
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ScheduledPage;
