"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, XCircle } from "lucide-react";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationProps {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  onClose?: (id: string) => void;
}

const NotificationItem: React.FC<NotificationProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(id), 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(id), 300);
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case "success":
        return "border-green-500/20";
      case "error":
        return "border-red-500/20";
      case "warning":
        return "border-yellow-500/20";
      case "info":
        return "border-blue-500/20";
      default:
        return "border-blue-500/20";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className={`relative overflow-hidden rounded-2xl border ${getBorderColor()} bg-white/10 backdrop-blur-xl shadow-2xl`}
        >
          {/* Glassmorphism background with subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-white/5" />

          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />

          {/* Content */}
          <div className="relative p-4 pr-12">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
              <div className="flex-1 min-w-0">
                {title && (
                  <h4 className="text-sm font-semibold text-white mb-1">
                    {title}
                  </h4>
                )}
                <p className="text-sm text-gray-300 leading-relaxed">
                  {message}
                </p>
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 group"
          >
            <X className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-200" />
          </button>

          {/* Progress bar */}
          {duration > 0 && (
            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-white/30 to-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-white/60 to-white/40"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: duration / 1000, ease: "linear" }}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Notification container that manages multiple notifications
export const NotificationContainer: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const addNotification = useCallback((notification: Omit<NotificationProps, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = {
      ...notification,
      id,
      onClose: removeNotification,
    };
    setNotifications((prev) => [...prev, newNotification]);
  }, []);

  // Expose addNotification globally
  useEffect(() => {
    (window as any).addNotification = addNotification;
    return () => {
      delete (window as any).addNotification;
    };
  }, [addNotification]);

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} {...notification} />
      ))}
    </div>
  );
};

// Hook for using notifications
export const useNotification = () => {
  const addNotification = (notification: Omit<NotificationProps, "id">) => {
    if (typeof window !== "undefined" && (window as any).addNotification) {
      (window as any).addNotification(notification);
    }
  };

  return { addNotification };
};

// Individual notification component for direct use
export const Notification: React.FC<Omit<NotificationProps, "id">> = (
  props
) => {
  const { addNotification } = useNotification();

  useEffect(() => {
    addNotification(props);
  }, [addNotification, props]);

  return null;
};

export default NotificationContainer;


