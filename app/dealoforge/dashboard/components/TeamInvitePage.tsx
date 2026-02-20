"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  Mail,
  Users,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Invite {
  _id: string;
  email: string;
  role: "employee" | "instructor" | "admin";
  status: "pending" | "accepted" | "expired";
  createdAt: string;
  expiresAt: string;
  invitedBy: {
    name: string;
    email: string;
  };
}

const TeamInvitePage = () => {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<
    "employee" | "instructor" | "admin"
  >("employee");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/enterprise/invite");
      if (!res.ok) throw new Error("Failed to fetch invites");
      const data = await res.json();
      setInvites(data.invites || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sendInvite = async () => {
    if (!inviteEmail.trim()) return;

    try {
      setSending(true);
      const res = await fetch("/api/enterprise/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to send invite");
      }

      setInviteEmail("");
      fetchInvites(); // Refresh list
      alert("Invite sent successfully!");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to send invite");
    } finally {
      setSending(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "expired":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-600";
      case "instructor":
        return "bg-blue-600";
      default:
        return "bg-green-600";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Team Management</h1>
        <p className="text-gray-400">Invite team members to your enterprise</p>
      </div>

      {/* Invite Form */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-green-400" />
          Send Team Invite
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="email"
            placeholder="colleague@yourcompany.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as any)}
            className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="employee">Employee</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>

          <button
            onClick={sendInvite}
            disabled={sending || !inviteEmail.trim()}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {sending ? "Sending..." : "Send Invite"}
            <Mail className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Invites List */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          Team Invites
        </h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {invites.map((invite, index) => (
              <motion.div
                key={invite._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(invite.status)}
                    <span className="text-white font-medium">
                      {invite.email}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs text-white ${getRoleColor(
                      invite.role
                    )}`}
                  >
                    {invite.role}
                  </span>
                </div>

                <div className="text-sm text-gray-400">
                  {invite.status === "pending" && (
                    <span>
                      Expires {new Date(invite.expiresAt).toLocaleDateString()}
                    </span>
                  )}
                  {invite.status === "accepted" && (
                    <span className="text-green-400">Accepted</span>
                  )}
                  {invite.status === "expired" && (
                    <span className="text-red-400">Expired</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {invites.length === 0 && !loading && (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No invites sent
            </h3>
            <p className="text-gray-400">
              Send your first team invite to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamInvitePage;
