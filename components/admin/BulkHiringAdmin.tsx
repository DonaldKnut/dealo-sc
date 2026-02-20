"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Briefcase,
} from "lucide-react";
import {
  getBulkHiringRequests,
  updateBulkHiringStatus,
  exportBulkHiringToCSV,
  type BulkHiringRequest,
} from "@/lib/bulk-hiring-utils";

const BulkHiringAdmin = () => {
  const [requests, setRequests] = useState<BulkHiringRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<BulkHiringRequest[]>(
    []
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] =
    useState<BulkHiringRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  useEffect(() => {
    if (selectedStatus === "all") {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(
        requests.filter((req) => req.status === selectedStatus)
      );
    }
  }, [selectedStatus, requests]);

  const loadRequests = async () => {
    setIsLoading(true);
    const data = await getBulkHiringRequests();
    setRequests(data);
    setFilteredRequests(data);
    setIsLoading(false);
  };

  const handleStatusUpdate = async (
    requestId: string,
    status: "pending" | "reviewing" | "approved" | "rejected"
  ) => {
    const result = await updateBulkHiringStatus(requestId, status);
    if (result.success) {
      loadRequests();
      alert("Status updated successfully");
    } else {
      alert("Failed to update status");
    }
  };

  const handleExport = () => {
    const csv = exportBulkHiringToCSV(filteredRequests);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bulk-hiring-requests-${new Date().toISOString()}.csv`;
    a.click();
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "reviewing":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "approved":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    reviewing: requests.filter((r) => r.status === "reviewing").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Bulk Hiring Requests
          </h1>
          <p className="text-gray-400">
            Manage and track all bulk hiring inquiries
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            {
              label: "Total",
              value: stats.total,
              color: "from-blue-500 to-blue-600",
            },
            {
              label: "Pending",
              value: stats.pending,
              color: "from-yellow-500 to-yellow-600",
            },
            {
              label: "Reviewing",
              value: stats.reviewing,
              color: "from-purple-500 to-purple-600",
            },
            {
              label: "Approved",
              value: stats.approved,
              color: "from-green-500 to-green-600",
            },
            {
              label: "Rejected",
              value: stats.rejected,
              color: "from-red-500 to-red-600",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <div
                className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}
              >
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {["all", "pending", "reviewing", "approved", "rejected"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedStatus === status
                      ? "bg-green-600 text-white"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              )
            )}
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 border border-white/20"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Requests List */}
        {isLoading ? (
          <div className="text-center text-white py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4">Loading requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center text-gray-400 py-12 bg-white/5 rounded-xl border border-white/10">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No requests found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredRequests.map((request, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-green-500/50 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">
                          {request.companyName}
                        </h3>
                        <p className="text-gray-400">{request.industry}</p>
                      </div>
                      <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status || "pending"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Users className="w-4 h-4 text-green-400" />
                        <span className="text-sm">
                          Team Size: {request.teamSize}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Briefcase className="w-4 h-4 text-blue-400" />
                        <span className="text-sm capitalize">
                          {request.hiringType}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span className="text-sm">{request.timeline}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar className="w-4 h-4 text-orange-400" />
                        <span className="text-sm">
                          {request.createdAt
                            ? new Date(request.createdAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {request.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {request.phone}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-300 text-sm mb-2">
                        <span className="font-semibold">Skills Required:</span>{" "}
                        {request.skills}
                      </p>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {request.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[180px]">
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowModal(true);
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>

                    {request.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusUpdate(request._id || "", "reviewing")
                          }
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300"
                        >
                          Start Review
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(request._id || "", "approved")
                          }
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(request._id || "", "rejected")
                          }
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}

                    {request.status === "reviewing" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusUpdate(request._id || "", "approved")
                          }
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(request._id || "", "rejected")
                          }
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal for Request Details */}
        {showModal && selectedRequest && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-white">
                  Request Details
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm">
                      Company Name
                    </label>
                    <p className="text-white font-semibold">
                      {selectedRequest.companyName}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">
                      Contact Name
                    </label>
                    <p className="text-white font-semibold">
                      {selectedRequest.contactName}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Email</label>
                    <p className="text-white font-semibold">
                      {selectedRequest.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Phone</label>
                    <p className="text-white font-semibold">
                      {selectedRequest.phone}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Industry</label>
                    <p className="text-white font-semibold">
                      {selectedRequest.industry}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Team Size</label>
                    <p className="text-white font-semibold">
                      {selectedRequest.teamSize}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Hiring Type</label>
                    <p className="text-white font-semibold capitalize">
                      {selectedRequest.hiringType}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Timeline</label>
                    <p className="text-white font-semibold">
                      {selectedRequest.timeline}
                    </p>
                  </div>
                </div>

                {selectedRequest.budget && (
                  <div>
                    <label className="text-gray-400 text-sm">Budget</label>
                    <p className="text-white font-semibold">
                      {selectedRequest.budget}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-gray-400 text-sm">
                    Required Skills
                  </label>
                  <p className="text-white">{selectedRequest.skills}</p>
                </div>

                <div>
                  <label className="text-gray-400 text-sm">
                    Project Description
                  </label>
                  <p className="text-white whitespace-pre-wrap">
                    {selectedRequest.description}
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-300"
                  >
                    Close
                  </button>
                  <a
                    href={`mailto:${selectedRequest.email}`}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 text-center"
                  >
                    Send Email
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkHiringAdmin;












