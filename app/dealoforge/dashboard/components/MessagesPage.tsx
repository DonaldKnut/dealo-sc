"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Search, Send, MoreVertical, UserPlus, Loader2 } from "lucide-react";
import { useSafeSession } from "@/hooks/use-safe-session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Connection {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string | null;
  createdAt: string;
}

interface Conversation {
  _id: string;
  userIds: string[];
  users: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    email: string;
  }>;
  isGroup: boolean;
  name?: string;
  lastMessage?: any;
  updatedAt: string;
}

interface Message {
  _id: string;
  body: string;
  senderId: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  conversationId: string;
  createdAt: string;
}

const MessagesPage = () => {
  const session = useSafeSession();
  const { data: sessionData } = session || {};
  const currentUserId = sessionData?.user?.id;

  const [connections, setConnections] = useState<Connection[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showConnections, setShowConnections] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch connected users
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await fetch("/api/dashboard/network");
        if (res.ok) {
          const data = await res.json();
          setConnections(data.connections || []);
        }
      } catch (error) {
        console.error("Failed to fetch connections:", error);
      }
    };

    if (currentUserId) {
      fetchConnections();
    }
  }, [currentUserId]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/conversations");
        if (res.ok) {
          const data = await res.json();
          setConversations(data.conversations || []);
        } else {
          setError("Failed to load conversations");
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
        setError("Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) {
      fetchConversations();
    }
  }, [currentUserId]);

  // Fetch messages when conversation is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation?._id) return;

      try {
        setLoading(true);
        const res = await fetch(
          `/api/conversations/${selectedConversation._id}/messages`
        );
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        } else {
          setError("Failed to load messages");
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        setError("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  // Real-time polling for new messages
  useEffect(() => {
    if (!selectedConversation?._id || !currentUserId) return;

    const pollForNewMessages = async () => {
      try {
        const res = await fetch(
          `/api/conversations/${selectedConversation._id}/messages?page=1&limit=50`
        );
        if (res.ok) {
          const data = await res.json();
          // Only update if we have new messages
          if (data.messages && data.messages.length > messages.length) {
            setMessages(data.messages);
          }
        }
      } catch (error) {
        console.error("Error polling for messages:", error);
      }
    };

    // Poll every 3 seconds
    pollingIntervalRef.current = setInterval(pollForNewMessages, 3000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [selectedConversation?._id, currentUserId, messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartConversation = async (userId: string) => {
    try {
      setSending(true);
      setError(null);
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          isGroup: false,
          members: [{ value: userId }],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Refresh conversations list
        const conversationsRes = await fetch("/api/conversations");
        if (conversationsRes.ok) {
          const conversationsData = await conversationsRes.json();
          setConversations(conversationsData.conversations || []);
          // Select the new conversation
          const newConv = conversationsData.conversations?.find(
            (c: Conversation) => c._id === data.conversation._id
          );
          if (newConv) {
            setSelectedConversation(newConv);
          }
        }
        setShowConnections(false);
      } else {
        setError("Failed to start conversation");
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
      setError("Failed to start conversation");
    } finally {
      setSending(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim() || !selectedConversation?._id || sending) return;

    try {
      setSending(true);
      setError(null);
      const res = await fetch("/api/messages/realtime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: selectedConversation._id,
          content: messageText.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Add the new message to the list
        setMessages((prev) => [...prev, data.message]);
        setMessageText("");
        // Refresh conversations to update last message
        const conversationsRes = await fetch("/api/conversations");
        if (conversationsRes.ok) {
          const conversationsData = await conversationsRes.json();
          setConversations(conversationsData.conversations || []);
        }
      } else {
        setError("Failed to send message");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setError("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const getOtherUser = (conversation: Conversation) => {
    if (!currentUserId) return null;
    return conversation.users.find((u) => u._id !== currentUserId);
  };

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

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now.getTime() - 86400000).toDateString() === date.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (isYesterday) {
      return `Yesterday ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else {
      return date.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach((msg) => {
      const date = new Date(msg.createdAt);
      const dateKey = date.toDateString();
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });

    return groups;
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now.getTime() - 86400000).toDateString() === date.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
    return date.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
  };

  const filteredConnections = connections.filter((conn) =>
    conn.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredConversations = conversations.filter((conv) => {
    const otherUser = getOtherUser(conv);
    if (!otherUser) return false;
    const name = `${otherUser.firstName} ${otherUser.lastName}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  if (!currentUserId) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Please sign in</h2>
          <p className="text-gray-400">
            You need to be logged in to access messages
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
        <p className="text-gray-400">Stay connected with your network</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="flex-1 flex bg-gray-800/50 rounded-2xl border border-gray-700 overflow-hidden">
        {/* Conversations List */}
        <div className="w-80 border-r border-gray-700 bg-gray-900/50 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-white">Conversations</h2>
              <Button
                onClick={() => setShowConnections(!showConnections)}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <UserPlus className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Connections List (when "New" is clicked) */}
          {showConnections && (
            <div className="flex-1 overflow-y-auto p-2">
              <h3 className="text-sm font-semibold text-gray-400 px-2 mb-2">
                Start a conversation
              </h3>
              {filteredConnections.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">
                    {searchQuery ? "No connections found" : "No connections yet"}
                  </p>
                </div>
              ) : (
                filteredConnections.map((connection) => (
                  <motion.div
                    key={connection.id}
                    whileHover={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}
                    className="p-3 rounded-lg cursor-pointer mb-1"
                    onClick={() => handleStartConversation(connection.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={connection.avatar || undefined} />
                        <AvatarFallback className="bg-green-600 text-white">
                          {connection.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium text-sm truncate">
                          {connection.name}
                        </h4>
                        <p className="text-gray-400 text-xs truncate">
                          {connection.role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Conversations List */}
          {!showConnections && (
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-green-500 animate-spin" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    No conversations yet
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Start a conversation with someone in your network
                  </p>
                  <Button
                    onClick={() => setShowConnections(true)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Start Conversation
                  </Button>
                </div>
              ) : (
                filteredConversations.map((conversation) => {
                  const otherUser = getOtherUser(conversation);
                  if (!otherUser) return null;

                  const isSelected = selectedConversation?._id === conversation._id;
                  const lastMessage = conversation.lastMessage;

                  return (
                    <motion.div
                      key={conversation._id}
                      whileHover={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}
                      className={`p-4 cursor-pointer border-b border-gray-700 ${
                        isSelected
                          ? "bg-green-600/10 border-green-500/20"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedConversation(conversation);
                        setShowConnections(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={otherUser.avatar || undefined} />
                          <AvatarFallback className="bg-green-600 text-white">
                            {otherUser.firstName.charAt(0).toUpperCase()}
                            {otherUser.lastName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-white font-medium text-sm truncate">
                              {otherUser.firstName} {otherUser.lastName}
                            </h3>
                            {conversation.updatedAt && (
                              <span className="text-gray-500 text-xs ml-2">
                                {formatTime(conversation.updatedAt)}
                              </span>
                            )}
                          </div>
                          {lastMessage && (
                            <p className="text-gray-400 text-xs truncate">
                              {typeof lastMessage === "string"
                                ? lastMessage
                                : lastMessage.body || "Message"}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              {(() => {
                const otherUser = getOtherUser(selectedConversation);
                if (!otherUser) return null;

                return (
                  <div className="p-4 border-b border-gray-700 bg-gray-900/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={otherUser.avatar || undefined} />
                        <AvatarFallback className="bg-green-600 text-white">
                          {otherUser.firstName.charAt(0).toUpperCase()}
                          {otherUser.lastName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-white font-semibold">
                          {otherUser.firstName} {otherUser.lastName}
                        </h3>
                        <p className="text-gray-400 text-sm">{otherUser.email}</p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                );
              })()}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-green-500 animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        No messages yet
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Start the conversation by sending a message
                      </p>
                    </div>
                  </div>
                ) : (
                  (() => {
                    const groupedMessages = groupMessagesByDate(messages);
                    return Object.entries(groupedMessages).map(([dateKey, dateMessages]) => (
                      <div key={dateKey}>
                        {/* Date Header */}
                        <div className="flex items-center justify-center my-4">
                          <div className="px-3 py-1 bg-gray-800/50 rounded-full border border-gray-700">
                            <span className="text-xs text-gray-400">
                              {formatDateHeader(dateKey)}
                            </span>
                          </div>
                        </div>
                        {/* Messages for this date */}
                        {dateMessages.map((msg, idx) => {
                          const isOwn = msg.senderId === currentUserId;
                          const prevMsg = idx > 0 ? dateMessages[idx - 1] : null;
                          const showAvatar = !isOwn && (!prevMsg || prevMsg.senderId !== msg.senderId);
                          const showName = !isOwn && (!prevMsg || prevMsg.senderId !== msg.senderId);

                          return (
                            <motion.div
                              key={msg._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex items-end gap-2 mb-2 ${
                                isOwn ? "justify-end" : "justify-start"
                              }`}
                            >
                              {!isOwn && showAvatar && (
                                <Avatar className="w-8 h-8 flex-shrink-0">
                                  <AvatarImage src={msg.sender.avatar || undefined} />
                                  <AvatarFallback className="bg-green-600 text-white text-xs">
                                    {msg.sender.firstName.charAt(0)}
                                    {msg.sender.lastName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              {!isOwn && !showAvatar && <div className="w-8" />}
                              <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"} max-w-xs lg:max-w-md`}>
                                {showName && (
                                  <p className="text-xs text-gray-400 mb-1 px-2">
                                    {msg.sender.firstName} {msg.sender.lastName}
                                  </p>
                                )}
                                <div
                                  className={`px-4 py-2 rounded-2xl ${
                                    isOwn
                                      ? "bg-green-600 text-white rounded-br-sm"
                                      : "bg-gray-700 text-white rounded-bl-sm"
                                  }`}
                                >
                                  <p className="text-sm whitespace-pre-wrap break-words">{msg.body}</p>
                                  <p
                                    className={`text-xs mt-1 ${
                                      isOwn ? "text-green-100" : "text-gray-400"
                                    }`}
                                  >
                                    {formatMessageTime(msg.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    ));
                  })()
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-700">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={sending}
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!messageText.trim() || sending}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </motion.button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-400">
                  Choose a conversation to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
