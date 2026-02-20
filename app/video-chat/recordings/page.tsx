"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileVideo,
  Play,
  Download,
  Trash2,
  Clock,
  Calendar,
  Search,
} from "lucide-react";

interface Recording {
  id: string;
  title: string;
  date: string;
  duration: string;
  size: string;
}

const RecordingsPage = () => {
  const router = useRouter();
  const [recordings] = useState<Recording[]>([]);
  const [search, setSearch] = useState("");

  const filtered = recordings.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

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
        <h1 className="text-2xl font-bold text-white mb-2">Recordings</h1>
        <p className="text-sm text-gray-500">
          Review and manage your meeting recordings
        </p>
      </motion.div>

      {/* Search */}
      {recordings.length > 0 && (
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
              placeholder="Search recordings..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-green-500/40 transition-all"
            />
          </div>
        </motion.div>
      )}

      {/* Recordings List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((rec, i) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 group hover:border-green-500/15 hover:bg-white/[0.04] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600/15 to-emerald-700/15 border border-green-500/10 flex items-center justify-center flex-shrink-0">
                    <FileVideo className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">
                      {rec.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {rec.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {rec.duration}
                      </span>
                      <span>{rec.size}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-500 hover:text-green-400 bg-white/[0.04] border border-white/[0.06] rounded-lg hover:bg-white/[0.08] transition-all">
                    <Play className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-white bg-white/[0.04] border border-white/[0.06] rounded-lg hover:bg-white/[0.08] transition-all">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-400 transition-colors">
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
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-600/10 to-emerald-700/10 border border-green-500/10 flex items-center justify-center mb-4">
            <FileVideo className="w-6 h-6 text-green-600/60" />
          </div>
          <p className="text-sm text-gray-400 mb-1 font-medium">
            No recordings yet
          </p>
          <p className="text-xs text-gray-600">
            Recordings will appear here after you record a meeting
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default RecordingsPage;
