"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "error" | "info";
  read: boolean;
  time: string;
  action?: {
    label: string;
    url: string;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "read" | "time">
  ) => void;
  markAsRead: (index: number) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export default function NotificationProvider({
  children,
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem("dealo-notifications");
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("dealo-notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Add sample notifications for demonstration
  useEffect(() => {
    const sampleNotifications: Omit<Notification, "id" | "read" | "time">[] = [
      {
        title: "Welcome to Dealo! 🎉",
        message:
          "Your account has been successfully created. Start exploring courses and opportunities!",
        type: "success",
        action: {
          label: "Explore Courses",
          url: "/dealoforge/courses",
        },
      },
      {
        title: "Profile Completion",
        message:
          "Complete your profile to unlock more features and get better recommendations.",
        type: "info",
        action: {
          label: "Complete Profile",
          url: "/dealoforge/profile",
        },
      },
      {
        title: "New Course Available",
        message:
          "Advanced React Development course is now available. Enroll now to get 20% off!",
        type: "success",
        action: {
          label: "View Course",
          url: "/dealoforge/courses/react-advanced",
        },
      },
    ];

    // Add sample notifications if none exist
    if (notifications.length === 0) {
      const now = new Date();
      const sampleNotificationsWithIds = sampleNotifications.map(
        (notification, index) => ({
          ...notification,
          id: `sample-${index}`,
          read: false,
          time: new Date(now.getTime() - index * 60000).toLocaleString(),
        })
      );
      setNotifications(sampleNotificationsWithIds);
    }
  }, [notifications.length]);

  const addNotification = (
    notification: Omit<Notification, "id" | "read" | "time">
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      time: new Date().toLocaleString(),
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Show browser notification if supported
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/favicon.ico",
      });
    }
  };

  const markAsRead = (index: number) => {
    setNotifications((prev) =>
      prev.map((notification, i) =>
        i === index ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
