"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowLeft,
  Users,
  Search,
  Video,
  Phone,
  MessageSquare,
  UserPlus,
  Star,
  StarOff,
} from "lucide-react";

interface Contact {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
  isFavorite?: boolean;
}

const ContactsPage = () => {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/connections");
      if (res.ok) {
        const data = await res.json();
        setContacts(data.connections || data || []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = contacts.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const favoriteContacts = filtered.filter((c) => favorites.has(c._id));
  const otherContacts = filtered.filter((c) => !favorites.has(c._id));

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const ContactCard = ({ contact }: { contact: Contact }) => (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 group hover:border-green-500/15 hover:bg-white/[0.04] transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {contact.image ? (
            <Image
              src={contact.image}
              alt={contact.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
              unoptimized
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-green-500/15 flex items-center justify-center">
              <span className="text-xs font-semibold text-green-400">
                {getInitials(contact.name || "?")}
              </span>
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold text-white">
              {contact.name}
            </h3>
            <p className="text-xs text-gray-500">{contact.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => toggleFavorite(contact._id)}
            className="p-2 text-gray-600 hover:text-yellow-400 transition-colors"
            title="Favorite"
          >
            {favorites.has(contact._id) ? (
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            ) : (
              <Star className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            className="p-2 text-gray-500 hover:text-green-400 bg-white/[0.04] border border-white/[0.06] rounded-lg hover:bg-white/[0.08] transition-all"
            title="Video call"
          >
            <Video className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => router.push("/messenger")}
            className="p-2 text-gray-500 hover:text-blue-400 bg-white/[0.04] border border-white/[0.06] rounded-lg hover:bg-white/[0.08] transition-all"
            title="Message"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
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
        <h1 className="text-2xl font-bold text-white mb-2">Contacts</h1>
        <p className="text-sm text-gray-500">
          Your connections — start a call or send a message
        </p>
      </motion.div>

      {/* Search */}
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
            placeholder="Search contacts..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-green-500/40 transition-all"
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/[0.06]" />
                <div className="space-y-2">
                  <div className="w-32 h-3 bg-white/[0.06] rounded" />
                  <div className="w-24 h-2.5 bg-white/[0.04] rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Favorites */}
          {favoriteContacts.length > 0 && (
            <div>
              <h3 className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3 flex items-center gap-1.5">
                <Star className="w-3 h-3 text-yellow-500" />
                Favorites
              </h3>
              <div className="space-y-2">
                {favoriteContacts.map((contact) => (
                  <ContactCard key={contact._id} contact={contact} />
                ))}
              </div>
            </div>
          )}

          {/* All contacts */}
          <div>
            {favoriteContacts.length > 0 && (
              <h3 className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
                All Contacts
              </h3>
            )}
            <div className="space-y-2">
              {otherContacts.map((contact) => (
                <ContactCard key={contact._id} contact={contact} />
              ))}
            </div>
          </div>
        </motion.div>
      ) : contacts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-12 flex flex-col items-center justify-center text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-600/10 border border-green-500/10 flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-green-600/60" />
          </div>
          <p className="text-sm text-gray-400 mb-1 font-medium">
            No contacts yet
          </p>
          <p className="text-xs text-gray-600 mb-5">
            Connect with other users to see them here
          </p>
          <button
            onClick={() => router.push("/")}
            className="text-xs text-green-400 border border-green-500/20 bg-green-500/[0.06] px-4 py-2 rounded-lg hover:bg-green-500/[0.12] transition-colors flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Find People
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-10 flex flex-col items-center justify-center text-center"
        >
          <Search className="w-6 h-6 text-gray-600 mb-3" />
          <p className="text-sm text-gray-400">
            No contacts matching &ldquo;{search}&rdquo;
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ContactsPage;
