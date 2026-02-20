"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Send,
  Heart,
  Reply,
  MoreVertical,
  X,
  MessageCircle,
  User,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useSafeSession } from "@/hooks/use-safe-session";
import UserRoleBadge from "./UserRoleBadge";

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role?: string;
    title?: string;
    isVerified?: boolean;
    verificationBadge?: string;
  };
  likes: string[];
  replies: Comment[];
  parentCommentId?: string;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RealtimeCommentsProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postTitle: string;
}

const RealtimeComments: React.FC<RealtimeCommentsProps> = ({
  isOpen,
  onClose,
  postId,
  postTitle,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(
    new Set()
  );
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const { data: session } = useSafeSession();

  // Scroll to bottom when new comments arrive
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  // Set up real-time connection for comments
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const connectToRealtime = useCallback(() => {
    if (!postId) return;

    const eventSource = new EventSource(
      `/api/posts/${postId}/comments/realtime`
    );

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "connected") {
          console.log("Connected to real-time comments");
        } else if (data.type === "new_comment") {
          setComments((prev) => [data.comment, ...prev]);
        } else if (data.type === "comment_liked") {
          setComments((prev) =>
            prev.map((comment) =>
              comment._id === data.commentId
                ? { ...comment, likes: data.likes }
                : comment
            )
          );
        }
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        if (isOpen && postId) {
          connectToRealtime();
        }
      }, 3000);
    };

    eventSourceRef.current = eventSource;
  }, [postId, isOpen]);

  useEffect(() => {
    if (isOpen && postId) {
      fetchComments();
      connectToRealtime();
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        setIsConnected(false);
      }
    };
  }, [isOpen, postId, fetchComments, connectToRealtime]);

  const sendComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment.trim(),
          parentCommentId: replyingTo,
        }),
      });

      if (response.ok) {
        setNewComment("");
        setReplyingTo(null);
        setReplyContent("");
        // Comment will be added via real-time connection
      }
    } catch (error) {
      console.error("Failed to send comment:", error);
    }
  };

  const sendReply = async (parentCommentId: string) => {
    if (!replyContent.trim()) return;

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyContent.trim(),
          parentCommentId,
        }),
      });

      if (response.ok) {
        setReplyContent("");
        setExpandedReplies((prev) => new Set(prev).add(parentCommentId));
        // Reply will be added via real-time connection
      }
    } catch (error) {
      console.error("Failed to send reply:", error);
    }
  };

  const toggleLike = async (commentId: string) => {
    try {
      const response = await fetch(
        `/api/posts/${postId}/comments/${commentId}/like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        // Like will be updated via real-time connection
      }
    } catch (error) {
      console.error("Failed to like comment:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (replyingTo) {
        sendReply(replyingTo);
      } else {
        sendComment();
      }
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
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
          className="bg-gray-900 rounded-3xl border border-white/20 w-full max-w-2xl h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-green-400" />
              <div>
                <h3 className="font-semibold text-white">Comments</h3>
                <p className="text-sm text-gray-400 truncate max-w-xs">
                  {postTitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-400" : "bg-red-400"
                }`}
              />
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  No Comments Yet
                </h3>
                <p className="text-gray-400 text-sm">
                  Be the first to comment on this post
                </p>
              </div>
            ) : (
              comments.map((comment) => {
                const isLiked = comment.likes.includes(session?.user?.id || "");
                const hasReplies =
                  comment.replies && comment.replies.length > 0;
                const isExpanded = expandedReplies.has(comment._id);

                return (
                  <motion.div
                    key={comment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 rounded-2xl p-4 border border-white/10"
                  >
                    {/* Comment Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-600">
                        <Image
                          src={comment.author.avatar || "/default-avatar.jpg"}
                          alt={`${comment.author.firstName} ${comment.author.lastName}`}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white text-sm">
                            {comment.author.firstName} {comment.author.lastName}
                          </span>
                          {comment.author.role && (
                            <UserRoleBadge
                              role={comment.author.role as any}
                              title={comment.author.title}
                              isVerified={comment.author.isVerified}
                              verificationBadge={
                                comment.author.verificationBadge
                              }
                              size="sm"
                              showIcon={false}
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(comment.createdAt)}</span>
                          {comment.isEdited && (
                            <>
                              <span>•</span>
                              <span>Edited</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Comment Content */}
                    <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                      {comment.content}
                    </p>

                    {/* Comment Actions */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleLike(comment._id)}
                        className={`flex items-center gap-1 text-xs transition-colors ${
                          isLiked
                            ? "text-red-500"
                            : "text-gray-400 hover:text-red-500"
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                        />
                        <span>{comment.likes.length}</span>
                      </button>

                      <button
                        onClick={() =>
                          setReplyingTo(
                            replyingTo === comment._id ? null : comment._id
                          )
                        }
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Reply className="w-4 h-4" />
                        <span>Reply</span>
                      </button>

                      {hasReplies && (
                        <button
                          onClick={() => toggleReplies(comment._id)}
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                          <span>{comment.replies.length} replies</span>
                        </button>
                      )}
                    </div>

                    {/* Reply Input */}
                    {replyingTo === comment._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 pt-3 border-t border-white/10"
                      >
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Write a reply..."
                            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                          />
                          <button
                            onClick={() => sendReply(comment._id)}
                            disabled={!replyContent.trim()}
                            className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })
            )}

            <div ref={commentsEndRef} />
          </div>

          {/* Comment Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-600">
                <Image
                  src={session?.user?.image || "/default-avatar.jpg"}
                  alt={session?.user?.name || "User"}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Write a comment..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                onClick={sendComment}
                disabled={!newComment.trim()}
                className="p-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RealtimeComments;
