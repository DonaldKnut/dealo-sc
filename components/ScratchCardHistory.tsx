"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  Loader2,
  History,
  Eye,
  Download,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";

interface ScratchCardTransaction {
  _id: string;
  transactionId: string;
  examType: string;
  quantity: number;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  totalAmount: number;
  status: "pending" | "completed" | "failed" | "refunded";
  scratchCards: Array<{
    pin: string;
    serial: string;
    examType: string;
    phone: string;
    status: string;
    expiryDate: string;
  }>;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ScratchCardHistoryProps {
  userEmail: string;
}

export default function ScratchCardHistory({
  userEmail,
}: ScratchCardHistoryProps) {
  const [transactions, setTransactions] = useState<ScratchCardTransaction[]>(
    []
  );
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ScratchCardTransaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const fetchTransactions = useCallback(
    async (page: number = 1, status: string = "") => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          email: userEmail,
          page: page.toString(),
          limit: "10",
        });

        if (status) {
          params.append("status", status);
        }

        const response = await fetch(
          `/api/scratch-cards/transactions?${params}`
        );
        const result = await response.json();

        if (response.ok && result.success) {
          setTransactions(result.data.transactions);
          setPagination(result.data.pagination);
        } else {
          throw new Error(result.error || "Failed to fetch transactions");
        }
      } catch (error: any) {
        console.error("Error fetching transactions:", error);
        toast.error(error.message || "Failed to load transaction history");
      } finally {
        setLoading(false);
      }
    },
    [userEmail]
  );

  useEffect(() => {
    fetchTransactions(currentPage, statusFilter);
  }, [fetchTransactions, currentPage, statusFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    fetchTransactions(currentPage, statusFilter);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "refunded":
        return <RefreshCw className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const downloadTransactionDetails = (transaction: ScratchCardTransaction) => {
    const content = `
Scratch Card Transaction Details

Transaction ID: ${transaction.transactionId}
Exam Type: ${transaction.examType}
Quantity: ${transaction.quantity}
Customer: ${transaction.customerName}
Email: ${transaction.customerEmail}
Phone: ${transaction.customerPhone}
Total Amount: ₦${transaction.totalAmount.toLocaleString()}
Status: ${transaction.status}
Payment Method: ${transaction.paymentMethod}
Date: ${formatDate(transaction.createdAt)}

Scratch Cards:
${transaction.scratchCards
  .map(
    (card, index) => `
Card ${index + 1}:
  PIN: ${card.pin}
  Serial: ${card.serial}
  Status: ${card.status}
  Expires: ${formatDate(card.expiryDate)}
`
  )
  .join("")}

Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scratch-card-${transaction.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">
          Loading transaction history...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <History className="w-8 h-8 text-blue-600 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Transaction History
            </h2>
            <p className="text-gray-600">Your scratch card purchase history</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          {pagination && (
            <div className="text-sm text-gray-600">
              Showing{" "}
              {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
              {Math.min(
                pagination.currentPage * pagination.itemsPerPage,
                pagination.totalItems
              )}{" "}
              of {pagination.totalItems} transactions
            </div>
          )}
        </div>
      </div>

      {/* Transactions List */}
      {transactions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No transactions found
          </h3>
          <p className="text-gray-600">
            {statusFilter
              ? `No ${statusFilter} transactions found.`
              : "You haven't made any scratch card purchases yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(transaction.status)}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {transaction.status.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {transaction.examType} Scratch Cards
                    </h3>
                    <p className="text-sm text-gray-600">
                      ID: {transaction.transactionId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedTransaction(transaction)}
                    className="flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </button>
                  <button
                    onClick={() => downloadTransactionDetails(transaction)}
                    className="flex items-center px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-md transition-colors"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Quantity:</span>
                  <p className="font-medium">{transaction.quantity} card(s)</p>
                </div>
                <div>
                  <span className="text-gray-600">Amount:</span>
                  <p className="font-medium">
                    ₦{transaction.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Payment:</span>
                  <p className="font-medium capitalize">
                    {transaction.paymentMethod.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Date:</span>
                  <p className="font-medium">
                    {formatDate(transaction.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-6">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 text-sm border rounded-md ${
                  page === pagination.currentPage
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Transaction Details
                </h3>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Transaction ID:</span>
                    <p className="font-medium">
                      {selectedTransaction.transactionId}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedTransaction.status)}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          selectedTransaction.status
                        )}`}
                      >
                        {selectedTransaction.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Exam Type:</span>
                    <p className="font-medium">
                      {selectedTransaction.examType}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Quantity:</span>
                    <p className="font-medium">
                      {selectedTransaction.quantity}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Amount:</span>
                    <p className="font-medium">
                      ₦{selectedTransaction.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment Method:</span>
                    <p className="font-medium capitalize">
                      {selectedTransaction.paymentMethod.replace("_", " ")}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Customer:</span>
                    <p className="font-medium">
                      {selectedTransaction.customerName}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">
                      {selectedTransaction.customerEmail}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <p className="font-medium">
                      {selectedTransaction.customerPhone}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <p className="font-medium">
                      {formatDate(selectedTransaction.createdAt)}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Scratch Cards
                  </h4>
                  <div className="space-y-3">
                    {selectedTransaction.scratchCards.map((card, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                      >
                        <h5 className="font-medium text-gray-900 mb-2">
                          Card {index + 1}
                        </h5>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">PIN:</span>
                            <p className="font-mono text-gray-900 bg-white px-2 py-1 rounded border">
                              {card.pin}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Serial:</span>
                            <p className="font-mono text-gray-900 bg-white px-2 py-1 rounded border">
                              {card.serial}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Status:</span>
                            <p className="text-gray-900">{card.status}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Expires:</span>
                            <p className="text-gray-900">
                              {formatDate(card.expiryDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() =>
                    downloadTransactionDetails(selectedTransaction)
                  }
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Details
                </button>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
