"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Clock,
  Building,
  Mail,
  Shield,
} from "lucide-react";

interface Enterprise {
  _id: string;
  companyName: string;
  primaryEmail: string;
  domain: string;
  trustLevel: "low" | "medium" | "high";
  approved?: boolean;
  verified: boolean;
  createdAt: string;
}

const AdminEnterprisesPage = () => {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  const fetchEnterprises = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== "all") params.set("status", filter);

      const res = await fetch(`/api/admin/enterprises?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch enterprises");

      const data = await res.json();
      setEnterprises(data.enterprises || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchEnterprises();
  }, [fetchEnterprises]);

  const handleApproval = async (enterpriseId: string, approved: boolean) => {
    try {
      const res = await fetch("/api/admin/enterprises", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enterpriseId, approved }),
      });

      if (!res.ok) throw new Error("Failed to update enterprise");

      fetchEnterprises(); // Refresh list
    } catch (error) {
      console.error(error);
      alert("Failed to update enterprise");
    }
  };

  const getTrustLevelColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (enterprise: Enterprise) => {
    if (!enterprise.verified)
      return <Clock className="w-5 h-5 text-gray-400" />;
    if (enterprise.approved === true)
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (enterprise.approved === false)
      return <XCircle className="w-5 h-5 text-red-400" />;
    return <Clock className="w-5 h-5 text-yellow-400" />;
  };

  const getStatusText = (enterprise: Enterprise) => {
    if (!enterprise.verified) return "Unverified";
    if (enterprise.approved === true) return "Approved";
    if (enterprise.approved === false) return "Rejected";
    return "Pending Review";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Enterprise Review
          </h1>
          <p className="text-gray-400">
            Review and approve enterprise registrations
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Enterprises List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {enterprises.map((enterprise, index) => (
              <motion.div
                key={enterprise._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Building className="w-6 h-6 text-green-400" />
                      <h3 className="text-xl font-semibold text-white">
                        {enterprise.companyName}
                      </h3>
                      {getStatusIcon(enterprise)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">
                          {enterprise.primaryEmail}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span
                          className={`font-medium ${getTrustLevelColor(
                            enterprise.trustLevel
                          )}`}
                        >
                          {enterprise.trustLevel.toUpperCase()} Trust
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm">
                        Domain: {enterprise.domain}
                      </div>
                    </div>

                    <div className="text-sm text-gray-400">
                      Registered:{" "}
                      {new Date(enterprise.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="text-sm text-gray-300 mb-2">
                      Status: {getStatusText(enterprise)}
                    </div>
                    {enterprise.verified &&
                      enterprise.approved === undefined && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproval(enterprise._id, true)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleApproval(enterprise._id, false)
                            }
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {enterprises.length === 0 && !loading && (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No enterprises found
            </h3>
            <p className="text-gray-400">
              No enterprises match the current filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEnterprisesPage;
