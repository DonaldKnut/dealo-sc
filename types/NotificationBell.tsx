"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import { getSocket } from "@/lib/socket";
import { useNotifyWithSound } from "./useNotifyWithSound";

interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { notify } = useNotifyWithSound();

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.isRead).length);
    };

    fetchNotifications();

    const socket = getSocket();

    socket.on("connect", () => {
      console.log("🔗 Connected to socket server");
    });

    socket.on("new_notification", (data: Notification) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);
      notify(data.title, data.message);
    });

    return () => {
      socket.off("new_notification");
    };
  }, [notify]);

  return (
    <div className="relative">
      <Link href="/notifications" className="relative p-2">
        <Bell className="text-white w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-1 text-xs">
            {unreadCount}
          </span>
        )}
      </Link>
    </div>
  );
};

export default NotificationBell;
