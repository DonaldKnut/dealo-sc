"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Search,
  MessageCircle,
  UserPlus,
  Loader2,
  Users,
  X,
  ArrowLeft,
  ChevronLeft,
} from "lucide-react";
import { useSafeSession } from "@/hooks/use-safe-session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

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
  lastMessage?: {
    _id: string;
    body: string;
    senderId: string;
    sender?: {
      firstName: string;
      lastName: string;
    };
    createdAt: string;
  } | null;
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

const MessengerPage = () => {
  const session = useSafeSession();
  const { data: sessionData } = session || {};
  const currentUserId = sessionData?.user?.id;

  const [connections, setConnections] = useState<Connection[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showConnections, setShowConnections] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  // Constants for strings to avoid hardcoding
  const STRINGS = {
    title: "Neural Messenger",
    identity: "Classification: Specialized Intelligence",
    newDirective: "Initialize Transmission",
    searchConversations: "Scanning Archive Links...",
    searchConnections: "Acquiring Operative Signals...",
    startChat: "Establish Connection",
    noMessages: "Zero neural activity detected in this channel.",
    typeMessage: "Input Transmission Cipher...",
    exit: "Exit To Perimeter",
    back: "Archive Index"
  };

  // Fetch connections (users you can chat with)
  const fetchConnections = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const res = await fetch("/api/dashboard/network");
      if (res.ok) {
        const data = await res.json();
        setConnections(data.connections || []);
      }
    } catch (error) {
      console.error("Failed to fetch connections:", error);
    }
  }, [currentUserId]);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!currentUserId) return;
    try {
      setConversationsLoading(true);
      setError(null);
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to load conversations");
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      setError("Failed to load conversations");
    } finally {
      setConversationsLoading(false);
      setLoading(false);
    }
  }, [currentUserId]);

  // Fetch messages for selected conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!conversationId) return;
    try {
      setMessagesLoading(true);
      setError(null);
      const res = await fetch(`/api/conversations/${conversationId}/messages`);
      if (res.ok) {
        const data = await res.json();
        const fetchedMessages = data.messages || [];
        setMessages(fetchedMessages);
        if (fetchedMessages.length > 0) {
          lastMessageIdRef.current = fetchedMessages[fetchedMessages.length - 1]._id;
        }
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to load messages");
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setError("Failed to load messages");
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  // Set up real-time updates using Server-Sent Events
  useEffect(() => {
    if (!selectedConversation?._id || !currentUserId) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      return;
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    const eventSource = new EventSource(
      `/api/messages/realtime?conversationId=${selectedConversation._id}`
    );
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "new_messages" && data.messages) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m._id));
            const newMessages = data.messages.filter(
              (msg: Message) => !existingIds.has(msg._id)
            );
            if (newMessages.length > 0) {
              lastMessageIdRef.current = newMessages[newMessages.length - 1]._id;
              fetchConversations();
              return [...prev, ...newMessages];
            }
            return prev;
          });
        }
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };
    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      eventSource.close();
      setTimeout(() => {
        if (selectedConversation?._id) fetchMessages(selectedConversation._id);
      }, 3000);
    };
    eventSourceRef.current = eventSource;
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [selectedConversation?._id, currentUserId, fetchConversations, fetchMessages]);

  useEffect(() => {
    if (currentUserId) {
      fetchConnections();
      fetchConversations();
    }
  }, [currentUserId, fetchConnections, fetchConversations]);

  useEffect(() => {
    if (selectedConversation?._id) {
      fetchMessages(selectedConversation._id);
    } else {
      setMessages([]);
    }
  }, [selectedConversation?._id, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartConversation = async (userId: string) => {
    if (!currentUserId) return;
    try {
      setSending(true);
      setError(null);
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isGroup: false, members: [{ value: userId }] }),
      });
      if (res.ok) {
        const data = await res.json();
        await fetchConversations();
        if (data.conversation) setSelectedConversation(data.conversation);
        setShowConnections(false);
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
    } finally {
      setSending(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation?._id || sending) return;
    const content = messageText.trim();
    setMessageText("");
    try {
      setSending(true);
      const res = await fetch("/api/messages/realtime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: selectedConversation._id, content }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.message) {
          setMessages((prev) => [...prev, data.message]);
          lastMessageIdRef.current = data.message._id;
        }
        await fetchConversations();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const getConversationName = (conversation: Conversation) => {
    if (conversation.isGroup && conversation.name) return conversation.name;
    const otherUser = getOtherUser(conversation);
    return otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : "Unknown Operative";
  };

  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.isGroup) return null;
    return getOtherUser(conversation)?.avatar || null;
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
    if (minutes < 1) return "PULSE";
    if (minutes < 60) return `${minutes}M`;
    if (hours < 24) return `${hours}H`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach((msg) => {
      const dateKey = new Date(msg.createdAt).toDateString();
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(msg);
    });
    return groups;
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) return "Today's Transmissions";
    return date.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }).toUpperCase();
  };

  const filteredConversations = conversations.filter((conv) =>
    getConversationName(conv).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredConnections = connections.filter((conn) =>
    conn.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!currentUserId) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <MessageCircle className="w-16 h-16 text-emerald-500/20 mx-auto" />
          <h2 className="text-2xl font-black uppercase tracking-tighter italic">Unauthorized Access</h2>
          <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Please calibrate your credentials</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen bg-black text-white selection:bg-emerald-500/30 overflow-hidden flex flex-col p-4 lg:p-6 relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[60%] h-[60%] bg-emerald-500/5 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-[0%] right-[20%] w-[60%] h-[60%] bg-green-500/5 blur-[140px] rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-125 contrast-150" />
      </div>

      <main className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col h-full gap-4 lg:gap-6">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
              <div className="w-10 h-px bg-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">{STRINGS.identity}</span>
            </motion.div>
            <h1 className="text-2xl lg:text-3xl font-black uppercase tracking-tighter italic">{STRINGS.title}</h1>
          </div>
          <Link href="/" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">{STRINGS.exit}</span>
          </Link>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-0">
          <aside className={`w-full lg:w-80 flex-col gap-6 ${selectedConversation ? "hidden lg:flex" : "flex"}`}>
            <div className="relative bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2rem] flex flex-col h-full overflow-hidden">
              <div className="p-4 lg:p-6 space-y-4 border-b border-white/5">
                <Button
                  onClick={() => { setShowConnections(!showConnections); setSearchQuery(""); }}
                  className="w-full py-6 bg-emerald-500 text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-3"
                >
                  <UserPlus className="w-4 h-4" />
                  {STRINGS.newDirective}
                </Button>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={showConnections ? STRINGS.searchConnections : STRINGS.searchConversations}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl pl-12 pr-4 py-3 text-[10px] font-black uppercase tracking-widest placeholder:text-gray-700 focus:outline-none focus:border-emerald-500/30 transition-all"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
                {showConnections ? (
                  filteredConnections.map((conn) => (
                    <motion.div
                      key={conn.id}
                      onClick={() => handleStartConversation(conn.id)}
                      className="p-4 rounded-2xl cursor-pointer hover:bg-emerald-500/5 transition-colors flex items-center gap-4 group"
                    >
                      <Avatar className="w-10 h-10 border border-white/10 group-hover:border-emerald-500/30 transition-colors">
                        <AvatarImage src={conn.avatar || undefined} />
                        <AvatarFallback className="bg-white/[0.03] text-emerald-500 font-black italic">{conn.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white truncate">{conn.name}</h4>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-700 truncate">{conn.role}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  filteredConversations.map((conv) => {
                    const isSelected = selectedConversation?._id === conv._id;
                    const name = getConversationName(conv);
                    const avatar = getConversationAvatar(conv);
                    return (
                      <motion.div
                        key={conv._id}
                        onClick={() => setSelectedConversation(conv)}
                        className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center gap-4 group ${isSelected ? "bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]" : "hover:bg-white/[0.03] border border-transparent"}`}
                      >
                        <div className="relative">
                          <Avatar className={`w-12 h-12 border ${isSelected ? "border-emerald-500/50" : "border-white/10"} transition-colors`}>
                            <AvatarImage src={avatar || undefined} />
                            <AvatarFallback className="bg-white/[0.03] text-emerald-500 font-black italic">{name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {isSelected && <div className="absolute -right-1 -top-1 w-3 h-3 bg-emerald-500 rounded-full border-4 border-black animate-pulse" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`text-[11px] font-black uppercase tracking-widest truncate ${isSelected ? "text-emerald-500" : "text-white"}`}>{name}</h4>
                            <span className="text-[8px] font-black text-gray-700">{formatTime(conv.updatedAt)}</span>
                          </div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-gray-700 truncate">
                            {conv.lastMessage?.body || "NO RECENT DATA"}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          </aside>

          <section className={`flex-1 flex-col gap-6 ${selectedConversation ? "flex" : "hidden lg:flex"}`}>
            {selectedConversation ? (
              <div className="relative flex-1 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2rem] lg:rounded-[2.5rem] flex flex-col overflow-hidden">
                <div className="p-4 lg:p-8 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4 lg:gap-6">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="lg:hidden p-2 hover:bg-white/5 rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6 text-emerald-500" />
                    </button>
                    <Avatar className="w-10 h-10 lg:w-14 lg:h-14 border border-emerald-500/20">
                      <AvatarImage src={getConversationAvatar(selectedConversation) || undefined} />
                      <AvatarFallback className="bg-white/[0.03] text-emerald-500 font-black italic text-lg lg:text-xl">{getConversationName(selectedConversation).charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5 lg:space-y-1">
                      <h3 className="text-sm lg:text-xl font-black uppercase tracking-tighter italic text-emerald-500">{getConversationName(selectedConversation)}</h3>
                      <div className="flex items-center gap-2 lg:gap-3">
                        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Secure Channel Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 lg:space-y-8 custom-scrollbar">
                  {messagesLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                    </div>
                  ) : Object.entries(groupMessagesByDate(messages)).map(([dateKey, dateMessages]) => (
                    <div key={dateKey} className="space-y-6 lg:space-y-8">
                      <div className="flex items-center justify-center gap-3 lg:gap-6">
                        <div className="flex-1 h-px bg-white/5" />
                        <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-[0.4em] text-gray-700 italic text-center">{formatDateHeader(dateKey)}</span>
                        <div className="flex-1 h-px bg-white/5" />
                      </div>
                      {dateMessages.map((msg) => {
                        const isOwn = msg.senderId === currentUserId;
                        return (
                          <motion.div
                            key={msg._id}
                            initial={{ opacity: 0, x: isOwn ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                          >
                            <div className={`max-w-[85%] lg:max-w-[70%] space-y-1.5 lg:space-y-2 ${isOwn ? "items-end text-right" : "items-start text-left"}`}>
                              <div className={`px-4 py-3 lg:px-6 lg:py-4 rounded-[1.5rem] lg:rounded-[2rem] text-[12px] lg:text-[13px] font-medium leading-relaxed relative ${isOwn ? "bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.1)]" : "bg-white/[0.03] border border-white/5 text-gray-200"}`}>
                                {msg.body}
                                <div className={`absolute bottom-[-10px] text-[7px] lg:text-[8px] font-black uppercase tracking-widest text-gray-700 ${isOwn ? "right-4" : "left-4"}`}>
                                  TIMESTAMP: {formatMessageTime(msg.createdAt)}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 lg:p-8 border-t border-white/5">
                  <form onSubmit={handleSendMessage} className="relative group/input">
                    <div className="absolute -inset-1 bg-emerald-500/5 blur-xl group-focus-within/input:bg-emerald-500/10 transition-colors rounded-2xl" />
                    <div className="relative flex gap-3 lg:gap-4">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder={STRINGS.typeMessage}
                        className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700"
                      />
                      <Button
                        type="submit"
                        disabled={!messageText.trim() || sending}
                        className="w-12 h-12 lg:w-14 lg:h-14 bg-emerald-500 text-black rounded-2xl flex items-center justify-center hover:bg-emerald-400 disabled:opacity-50 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 p-0 shrink-0"
                      >
                        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2rem] lg:rounded-[2.5rem] flex flex-col items-center justify-center p-6 lg:p-12 text-center space-y-4 lg:space-y-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/10 blur-[80px] rounded-full animate-pulse" />
                  <MessageCircle className="w-16 h-16 lg:w-24 lg:h-24 text-emerald-500/20 relative animate-bounce" />
                </div>
                <div className="space-y-2 lg:space-y-4">
                  <h3 className="text-lg lg:text-2xl font-black uppercase tracking-tighter italic">{STRINGS.noMessages}</h3>
                  <p className="text-gray-600 text-[8px] lg:text-[10px] font-black uppercase tracking-[0.4em]">Initialize Connection To Begin Data Transmission</p>
                </div>
                <Button
                  onClick={() => setShowConnections(true)}
                  className="px-6 lg:px-10 py-5 lg:py-7 bg-white/[0.03] border border-white/10 rounded-2xl text-[8px] lg:text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-500 hover:text-black transition-all"
                >
                  {STRINGS.startChat}
                </Button>
              </div>
            )}
          </section>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.2); }
      `}</style>
    </div>
  );
};

export default MessengerPage;
