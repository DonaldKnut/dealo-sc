"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  X,
  MessageCircle,
  User,
  Clock,
} from "lucide-react";
import { useSafeSession } from "@/hooks/use-safe-session";
import UserRoleBadge from "./UserRoleBadge";

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  messageType: "text" | "image" | "file";
  createdAt: string;
  isRead: boolean;
}

interface Conversation {
  _id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: string;
  isActive: boolean;
}

interface RealtimeMessagingProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId?: string;
  recipientId?: string;
}

const RealtimeMessaging: React.FC<RealtimeMessagingProps> = ({
  isOpen,
  onClose,
  conversationId,
  recipientId,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(
    conversationId || null
  );
  const [isConnected, setIsConnected] = useState(false);
  const [typing, setTyping] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const { data: session } = useSafeSession();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Set up real-time connection
  const connectToRealtime = useCallback(() => {
    if (!activeConversation) return;

    const eventSource = new EventSource(
      `/api/messages/realtime?conversationId=${activeConversation}`
    );

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "connected") {
          console.log("Connected to real-time messaging");
        } else if (data.type === "new_messages") {
          setMessages((prev) => [...data.messages, ...prev]);
        } else if (data.type === "typing") {
          setTyping((prev) => {
            if (data.isTyping) {
              return Array.from(new Set([...prev, data.userId]));
            } else {
              return prev.filter((id) => id !== data.userId);
            }
          });
        }
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        if (isOpen && activeConversation) {
          connectToRealtime();
        }
      }, 3000);
    };

    eventSourceRef.current = eventSource;
  }, [activeConversation, isOpen]);

  useEffect(() => {
    if (isOpen && activeConversation) {
      connectToRealtime();
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        setIsConnected(false);
      }
    };
  }, [isOpen, activeConversation, connectToRealtime]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    try {
      const response = await fetch("/api/messages/realtime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConversation,
          content: newMessage.trim(),
          messageType: "text",
        }),
      });

      if (response.ok) {
        setNewMessage("");
        // Message will be added via real-time connection
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-3xl border border-white/20 w-full max-w-4xl h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Marketplace Chat</h3>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? "bg-green-400" : "bg-red-400"
                    }`}
                  />
                  <span className="text-xs text-gray-400">
                    {isConnected ? "Connected" : "Connecting..."}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Phone className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Video className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col h-full">
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Start a Conversation
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Send a message to connect with freelancers and clients
                  </p>
                </div>
              ) : (
                messages.map((message) => {
                  const isOwn = message.sender._id === session?.user?.id;

                  return (
                    <motion.div
                      key={message._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        isOwn ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md ${
                          isOwn ? "order-2" : "order-1"
                        }`}
                      >
                        {!isOwn && (
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-full bg-gray-600 overflow-hidden">
                              <Image
                                src={
                                  message.sender.avatar || "/default-avatar.jpg"
                                }
                                alt={message.sender.firstName}
                                width={24}
                                height={24}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-xs text-gray-400">
                              {message.sender.firstName}{" "}
                              {message.sender.lastName}
                            </span>
                          </div>
                        )}

                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isOwn
                              ? "bg-green-600 text-white"
                              : "bg-white/10 text-white"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>

                        <div
                          className={`flex items-center gap-1 mt-1 ${
                            isOwn ? "justify-end" : "justify-start"
                          }`}
                        >
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">
                            {formatTime(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}

              {/* Typing Indicator */}
              {typing.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-gray-400 text-sm"
                >
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                  <span>
                    {typing.length} user{typing.length > 1 ? "s" : ""} typing...
                  </span>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5 text-gray-400" />
                </button>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Smile className="w-5 h-5 text-gray-400" />
                </button>

                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RealtimeMessaging;
