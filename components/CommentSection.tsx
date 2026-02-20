"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  };
  likes: string[];
  replies: Comment[];
  createdAt: string;
  isEdited: boolean;
  likeCount: number;
  replyCount: number;
}

interface CommentSectionProps {
  workId: string;
  initialComments?: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({
  workId,
  initialComments = [],
}) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState<Set<string>>(new Set());
  const session = useSafeSession();

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${workId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  }, [workId]);

  useEffect(() => {
    fetchComments();
  }, [workId, fetchComments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !session?.data?.user?.id) return;

    try {
      const response = await fetch(`/api/posts/${workId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments([data.comment, ...comments]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!session?.data?.user?.id) return;

    try {
      const response = await fetch(
        `/api/posts/${workId}/comments/${commentId}/like`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        // Update the comment in the local state
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: comment.likes.includes(session.data.user.id)
                    ? comment.likes.filter((id) => id !== session.data.user.id)
                    : [...comment.likes, session.data.user.id],
                  likeCount: comment.likes.includes(session.data.user.id)
                    ? comment.likeCount - 1
                    : comment.likeCount + 1,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.error("Failed to like comment:", error);
    }
  };

  const toggleReplies = (commentId: string) => {
    setShowReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const isLiked = comment.likes.includes(session?.data?.user?.id || "");
    const showRepliesForThis = showReplies.has(comment._id);

    return (
      <motion.div
        key={comment._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${
          isReply ? "ml-8 mt-3" : ""
        } bg-gray-800/50 rounded-lg p-4 border border-gray-700`}
      >
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            {comment.author.avatar ? (
              <Image
                src={comment.author.avatar}
                alt={`${comment.author.firstName} ${comment.author.lastName}`}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white font-medium text-sm">
                {comment.author.firstName} {comment.author.lastName}
              </span>
              {comment.author.role && (
                <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full">
                  {comment.author.role}
                </span>
              )}
              <span className="text-gray-400 text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(comment.createdAt)}
              </span>
              {comment.isEdited && (
                <span className="text-gray-500 text-xs">(edited)</span>
              )}
            </div>

            <p className="text-gray-300 text-sm mb-3">{comment.content}</p>

            <div className="flex items-center gap-4">
              <button
                onClick={() => handleLikeComment(comment._id)}
                className={`flex items-center gap-1 text-xs transition-colors ${
                  isLiked ? "text-red-400" : "text-gray-400 hover:text-red-400"
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                {comment.likeCount}
              </button>

              <button
                onClick={() =>
                  setReplyingTo(replyingTo === comment._id ? null : comment._id)
                }
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Reply className="w-4 h-4" />
                Reply
              </button>

              {comment.replyCount > 0 && (
                <button
                  onClick={() => toggleReplies(comment._id)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  {showRepliesForThis ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  {comment.replyCount} replies
                </button>
              )}
            </div>

            {/* Reply Form */}
            {replyingTo === comment._id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3"
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // Handle reply submission
                    setReplyingTo(null);
                    setReplyContent("");
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!replyContent.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}

            {/* Replies */}
            <AnimatePresence>
              {showRepliesForThis && comment.replies && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 space-y-3"
                >
                  {comment.replies.map((reply) => renderComment(reply, true))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Comment Form */}
      {session?.data?.user && (
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <form onSubmit={handleSubmitComment} className="flex gap-3">
            <div className="flex-shrink-0">
              {session.data.user.avatar ? (
                <Image
                  src={session.data.user.avatar}
                  alt={session.data.user.name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!newComment.trim() || loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {loading ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {loading && comments.length === 0 ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-400 mt-2">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">
              No comments yet. Be the first to comment!
            </p>
          </div>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
