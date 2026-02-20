"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  MessageCircle,
  UserPlus,
  Building,
  MapPin,
} from "lucide-react";
import EmptyState from "@/components/EmptyState";

const NetworkPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/dashboard/network", {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        setConnections(data.connections || []);
      } catch { } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredConnections = connections.filter(
    (connection) =>
      connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-12">
        <div className="animate-pulse space-y-4">
          <div className="h-20 w-1/3 bg-white/5 rounded-3xl" />
          <div className="h-6 w-1/4 bg-white/5 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white/5 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  const networkStats = [
    { title: "Connections", value: String(connections.length || 0), icon: Users, trend: "" },
    { title: "Pending", value: "0", icon: UserPlus, trend: "" },
    { title: "Messages", value: "0", icon: MessageCircle, trend: "" },
  ];

  return (
    <div className="space-y-16">
      {/* ── HEADER SECTION ── */}
      <section className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-[9px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-6 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
            <Users className="w-3 h-3" />
            Your network
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] uppercase mb-4">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600">connections</span>
          </h1>
          <p className="text-white/30 font-bold uppercase tracking-[0.25em] text-xs md:text-sm max-w-xl leading-relaxed">
            People you've connected with. Search, message, and grow your network.
          </p>
        </motion.div>
      </section>

      {/* ── STATS GRID (DASHBOARD STYLE) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {networkStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-1 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:border-emerald-500/40 transition-all duration-500 group shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
              <div className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="h-6 w-px bg-white/10" />
                  {stat.trend ? <p className="text-[10px] font-black text-emerald-500/40 group-hover:text-emerald-400 tracking-widest">{stat.trend}</p> : null}
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">{stat.title}</p>
                  <p className="text-3xl font-black text-white group-hover:text-emerald-400 transition-colors">
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── SEARCH ── */}
      <div className="relative group max-w-2xl">
        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/20 group-focus-within:text-emerald-500 w-5 h-5 transition-colors" />
        <input
          type="text"
          placeholder="Search by name, role, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-16 pr-6 py-6 bg-white/[0.02] border border-white/[0.05] rounded-[2rem] text-white placeholder:text-white/10 uppercase font-black text-[10px] tracking-[0.3em] focus:outline-none focus:bg-white/[0.04] focus:border-emerald-500/30 transition-all shadow-2xl"
        />
      </div>

      {/* ── CONNECTIONS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredConnections.map((connection, index) => (
          <motion.div
            key={connection.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="p-1 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] hover:border-emerald-500/30 transition-all duration-500 group relative shadow-2xl overflow-hidden"
          >
            <div className="p-8 space-y-6">
              {/* Profile Header */}
              <div className="flex items-center justify-between">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-green-600/20 rounded-full flex items-center justify-center border-2 border-white/10 group-hover:border-emerald-500 transition-all duration-500 overflow-hidden backdrop-blur-3xl">
                    <span className="text-2xl font-black text-white group-hover:scale-110 transition-transform">
                      {(connection.name || "U").substring(0, 1).toUpperCase()}
                    </span>
                  </div>
                  <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-[#050505] shadow-[0_0_10px_rgba(16,185,129,0.3)] ${connection.isOnline ? "bg-emerald-500" : "bg-white/10"}`} />
                </div>
                <div className="text-right">
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${connection.isOnline ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-white/20 border border-white/10"}`}>
                    {connection.isOnline ? "ONLINE" : "OFFLINE"}
                  </span>
                </div>
              </div>

              {/* Identity info */}
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors">
                  {connection.name}
                </h3>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{connection.role}</p>
              </div>

              <div className="space-y-3 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 text-white/40">
                  <Building className="w-4 h-4 text-emerald-500/40" />
                  <span className="text-xs font-bold uppercase tracking-wider">{connection.company}</span>
                </div>
                <div className="flex items-center gap-3 text-white/40">
                  <MapPin className="w-4 h-4 text-emerald-500/40" />
                  <span className="text-xs font-bold uppercase tracking-wider">{connection.location}</span>
                </div>
                <div className="flex items-center gap-3 text-white/40">
                  <Users className="w-4 h-4 text-emerald-500/40" />
                  <span className="text-xs font-bold uppercase tracking-wider">{connection.mutualConnections} LINKS</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-4 bg-emerald-500 text-black rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-xl"
                >
                  MESSAGE
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
                >
                  SECURE LINK
                </motion.button>
              </div>
            </div>
            {/* Decorative side accent */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-emerald-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>

      {/* Empty States */}
      {filteredConnections.length === 0 && connections.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No connections yet"
          description="Connect with other professionals. Search for people by role or skills and send connection requests."
          illustration="🤝"
          action={{
            label: "Find people",
            href: "/search/professionals",
          }}
        />
      ) : filteredConnections.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No results"
          description="Try a different search or browse by role or company."
          illustration="🔍"
        />
      ) : null}
    </div>
  );
};

export default NetworkPage;
