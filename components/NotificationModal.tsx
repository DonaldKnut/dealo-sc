"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Loader2,
  MessageSquare,
  CreditCard,
  ShoppingBag,
  Settings,
  AlertCircle,
} from "lucide-react";
import { useSafeSession } from "@/hooks/use-safe-session";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "order" | "payment" | "message" | "system";
  isRead: boolean;
  createdAt: string;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const session = useSafeSession();
  const { data: sessionData } = session || {};
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [markingAsRead, setMarkingAsRead] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!sessionData?.user?.id) return;

    try {
      setLoading(true);
      const res = await fetch("/api/notifications?limit=50");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [sessionData?.user?.id]);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      setMarkingAsRead(true);
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationIds: [notificationId],
        }),
      });

      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    } finally {
      setMarkingAsRead(false);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      setMarkingAsRead(true);
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          markAllAsRead: true,
        }),
      });

      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    } finally {
      setMarkingAsRead(false);
    }
  };

  // Fetch notifications when modal opens
  useEffect(() => {
    if (isOpen && sessionData?.user?.id) {
      fetchNotifications();
    }
  }, [isOpen, sessionData?.user?.id, fetchNotifications]);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Get icon for notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="w-5 h-5" />;
      case "payment":
        return <CreditCard className="w-5 h-5" />;
      case "message":
        return <MessageSquare className="w-5 h-5" />;
      case "system":
        return <Settings className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  // Get color for notification type
  const getNotificationColor = (type: string) => {
    switch (type) {
      case "order":
        return "from-blue-500 to-blue-600";
      case "payment":
        return "from-green-500 to-green-600";
      case "message":
        return "from-purple-500 to-purple-600";
      case "system":
        return "from-gray-500 to-gray-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 right-4 w-[400px] max-h-[600px] bg-gradient-to-br from-black via-[#0f1a0f] to-black border border-green-400/30 rounded-2xl shadow-2xl z-[201] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-bold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    disabled={markingAsRead}
                    className="p-1.5 text-green-400 hover:text-green-300 transition-colors disabled:opacity-50"
                    title="Mark all as read"
                  >
                    {markingAsRead ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCheck className="w-4 h-4" />
                    )}
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-green-500 animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <Bell className="w-12 h-12 text-gray-600 mb-4" />
                  <p className="text-gray-400 text-sm text-center">
                    No notifications yet
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 hover:bg-gray-800/50 transition-colors cursor-pointer ${
                        !notification.isRead ? "bg-gray-800/30" : ""
                      }`}
                      onClick={() => !notification.isRead && markAsRead(notification._id)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getNotificationColor(
                            notification.type
                          )} flex items-center justify-center flex-shrink-0`}
                        >
                          <div className="text-white">
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-white mb-1">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-400 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {formatTime(notification.createdAt)}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;
