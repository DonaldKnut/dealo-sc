"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  History,
  Clock,
  Calendar,
  Users,
  Video,
  Search,
  Phone,
  PhoneOutgoing,
  PhoneIncoming,
} from "lucide-react";

interface PastMeeting {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: number;
  type: "outgoing" | "incoming" | "group";
}

const HistoryPage = () => {
  const router = useRouter();
  const [meetings] = useState<PastMeeting[]>([]);
  const [search, setSearch] = useState("");

  const filtered = meetings.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  const getTypeIcon = (type: PastMeeting["type"]) => {
    switch (type) {
      case "outgoing":
        return <PhoneOutgoing className="w-3.5 h-3.5 text-green-400" />;
      case "incoming":
        return <PhoneIncoming className="w-3.5 h-3.5 text-blue-400" />;
      case "group":
        return <Users className="w-3.5 h-3.5 text-purple-400" />;
    }
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
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white mb-2">Meeting History</h1>
        <p className="text-sm text-gray-500">
          Review your past meetings and call logs
        </p>
      </motion.div>

      {/* Search */}
      {meetings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search past meetings..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-green-500/40 transition-all"
            />
          </div>
        </motion.div>
      )}

      {/* History List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((meeting, i) => (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 group hover:border-green-500/15 hover:bg-white/[0.04] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                    {getTypeIcon(meeting.type)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">
                      {meeting.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {meeting.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {meeting.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {meeting.participants}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="px-3 py-2 text-xs font-medium text-green-400 border border-green-500/20 bg-green-500/[0.06] rounded-lg hover:bg-green-500/[0.12] transition-colors">
                  Rejoin
                </button>
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
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
            <History className="w-6 h-6 text-gray-600" />
          </div>
          <p className="text-sm text-gray-400 mb-1 font-medium">
            No meeting history
          </p>
          <p className="text-xs text-gray-600">
            Your past meetings will appear here
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default HistoryPage;
