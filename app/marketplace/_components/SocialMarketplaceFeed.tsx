"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Eye,
  DollarSign,
  Clock,
  Star,
  MapPin,
  Calendar,
} from "lucide-react";
import { useSafeSession } from "@/hooks/use-safe-session";
import { IWork } from "@/types";
import UserRoleBadge from "./UserRoleBadge";
import RealtimeMessaging from "./RealtimeMessaging";
import RealtimeComments from "./RealtimeComments";
import FreelancerInsightsTrigger from "./FreelancerInsightsTrigger";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface WorkPost extends IWork {
  creator: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    location?: string;
    followersCount?: number;
    isFollowing?: boolean;
    role?: "student" | "freelancer" | "instructor" | "company" | "admin";
    title?: string;
    isVerified?: boolean;
    verificationBadge?: string;
  };
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  createdAt: string;
}

interface SocialMarketplaceFeedProps {
  initialPosts?: IWork[];
}

const SocialMarketplaceFeed: React.FC<SocialMarketplaceFeedProps> = ({
  initialPosts = [],
}) => {
  const [posts, setPosts] = useState<WorkPost[]>(() =>
    initialPosts.map((work) => ({
      ...work,
      creator:
        typeof work.creator === "string"
          ? {
              _id: work.creator,
              firstName: "Unknown",
              lastName: "User",
              role: "freelancer",
              title: "Freelancer",
              isVerified: false,
            }
          : {
              ...work.creator,
              role: work.creator.role || "freelancer",
              title: work.creator.title || "Freelancer",
              isVerified: work.creator.isVerified || false,
              verificationBadge: work.creator.verificationBadge || undefined,
            },
      likesCount: Math.floor(Math.random() * 100) + 10,
      commentsCount: Math.floor(Math.random() * 50) + 5,
      sharesCount: Math.floor(Math.random() * 20) + 2,
      isLiked: false,
      createdAt:
        typeof work.createdAt === "string"
          ? work.createdAt
          : new Date().toISOString(),
    }))
  );
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());
  const [currentMediaIndex, setCurrentMediaIndex] = useState<
    Record<string, number>
  >({});
  const [showMessaging, setShowMessaging] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedPostTitle, setSelectedPostTitle] = useState<string>("");
  const [viewedFreelancers, setViewedFreelancers] = useState<Set<string>>(
    new Set()
  );
  const [currentFreelancer, setCurrentFreelancer] = useState<any>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { data: session } = useSafeSession();
  const router = useRouter();

  // Intersection Observer for infinite scroll
  const loadMorePosts = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/work/all?page=${page + 1}&limit=10`);
      const result = await response.json();

      if (result.success && result.data.length > 0) {
        setPosts((prev) => [...prev, ...result.data]);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, page]);

  const lastPostRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePosts();
        }
      });

      if (node && observerRef.current) observerRef.current.observe(node);
    },
    [loading, hasMore, loadMorePosts]
  );

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setPosts((prev) =>
          prev.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  isLiked: !post.isLiked,
                  likesCount: post.isLiked
                    ? post.likesCount - 1
                    : post.likesCount + 1,
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setPosts((prev) =>
          prev.map((post) =>
            post.creator._id === userId
              ? {
                  ...post,
                  creator: {
                    ...post.creator,
                    isFollowing: !post.creator.isFollowing,
                    followersCount: post.creator.isFollowing
                      ? (post.creator.followersCount || 0) - 1
                      : (post.creator.followersCount || 0) + 1,
                  },
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  };

  const toggleVideoPlay = (postId: string, mediaIndex: number) => {
    const videoId = `${postId}-${mediaIndex}`;
    const videoElement = document.getElementById(videoId) as HTMLVideoElement;

    if (videoElement) {
      if (playingVideos.has(videoId)) {
        videoElement.pause();
        setPlayingVideos((prev) => {
          const newSet = new Set(prev);
          newSet.delete(videoId);
          return newSet;
        });
      } else {
        videoElement.play();
        setPlayingVideos((prev) => new Set(prev).add(videoId));
      }
    }
  };

  const navigateMedia = (postId: string, direction: "prev" | "next") => {
    const post = posts.find((p) => p._id === postId);
    if (!post) return;

    const currentIndex = currentMediaIndex[postId] || 0;
    const maxIndex = post.workMedia.length - 1;

    let newIndex;
    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
    } else {
      newIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
    }

    setCurrentMediaIndex((prev) => ({ ...prev, [postId]: newIndex }));
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor(
      (now.getTime() - postDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handlePayNow = async (post: WorkPost) => {
    if (!session?.user?.id) {
      router.push("/sign-in");
      return;
    }
    try {
      const requirements =
        window.prompt(
          "Describe what you want the freelancer to deliver (requirements):"
        ) || "";
      const res = await fetch("/api/marketplace/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workId: post._id,
          freelancerId:
            typeof post.creator === "object" ? post.creator._id : post.creator,
          amount: post.price,
          requirements,
        }),
      });
      const data = await res.json();
      if (data?.success && data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        alert(data?.error || "Unable to initialize payment");
      }
    } catch (e) {
      console.error(e);
      alert("Payment init failed");
    }
  };

  // Track when user views a freelancer's content
  const trackFreelancerView = (post: WorkPost) => {
    const freelancerId = post.creator._id;

    // If user has not viewed this freelancer before, set them as current
    if (!viewedFreelancers.has(freelancerId)) {
      setCurrentFreelancer({
        _id: freelancerId,
        firstName: post.creator.firstName,
        lastName: post.creator.lastName,
        avatar: post.creator.avatar,
        role: post.creator.role,
        title: post.creator.title,
        isVerified: post.creator.isVerified,
        verificationBadge: post.creator.verificationBadge,
        location: post.creator.location,
        rating: 4.5 + Math.random() * 0.5, // Mock rating
        completedProjects: Math.floor(Math.random() * 50) + 10, // Mock projects
        responseTime: Math.random() > 0.5 ? "2 hours" : "1 day", // Mock response time
        completionRate: 95 + Math.floor(Math.random() * 5), // Mock completion rate
        totalEarnings: Math.floor(Math.random() * 50000) + 10000, // Mock earnings
        skills: post.skills || ["React", "Node.js", "Design"],
        portfolioLinks: ["https://portfolio.example.com"],
        socialPresence: {
          linkedin: "https://linkedin.com/in/example",
          github: "https://github.com/example",
        },
        recentReviews: [
          {
            rating: 5,
            comment: "Excellent work, very professional!",
            client: "John Doe",
            date: "2 days ago",
          },
        ],
        specialties: ["Web Development", "UI/UX Design"],
        availability: "Available",
        languages: ["English", "Spanish"],
      });

      setViewedFreelancers((prev) => new Set(prev).add(freelancerId));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {posts.map((post, index) => {
        const isLastPost = index === posts.length - 1;
        const currentMediaIdx = currentMediaIndex[post._id] || 0;
        const currentMedia = post.workMedia[currentMediaIdx];
        const videoId = `${post._id}-${currentMediaIdx}`;
        const isVideoPlaying = playingVideos.has(videoId);

        return (
          <motion.div
            key={post._id}
            ref={isLastPost ? lastPostRef : null}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-600">
                  <Image
                    src={post.creator.avatar || "/default-avatar.jpg"}
                    alt={`${post.creator.firstName} ${post.creator.lastName}`}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-white">
                      {post.creator.firstName} {post.creator.lastName}
                    </h3>
                    {post.creator.location && (
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <MapPin className="w-3 h-3" />
                        <span>{post.creator.location}</span>
                      </div>
                    )}
                  </div>

                  {/* User Role Badge */}
                  <div className="mb-2">
                    <UserRoleBadge
                      role={post.creator.role || "freelancer"}
                      title={post.creator.title}
                      isVerified={post.creator.isVerified}
                      verificationBadge={post.creator.verificationBadge}
                      size="sm"
                    />
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span>{formatTimeAgo(post.createdAt)}</span>
                    <span>•</span>
                    <span>{post.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current text-yellow-400" />
                      <span>{post.experienceLevel}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!post.creator.isFollowing && (
                  <button
                    onClick={() => handleFollow(post.creator._id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-1"
                  >
                    <UserPlus className="w-4 h-4" />
                    Follow
                  </button>
                )}
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Media Section */}
            <div
              className="relative aspect-[4/5] bg-black"
              onMouseEnter={() => trackFreelancerView(post)}
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={currentMediaIdx}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentMedia?.type === "image" ? (
                    <Image
                      src={currentMedia.url}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <video
                        id={videoId}
                        src={currentMedia?.url}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                        onPlay={() =>
                          setPlayingVideos((prev) => new Set(prev).add(videoId))
                        }
                        onPause={() =>
                          setPlayingVideos((prev) => {
                            const newSet = new Set(prev);
                            newSet.delete(videoId);
                            return newSet;
                          })
                        }
                      />
                      <button
                        onClick={() =>
                          toggleVideoPlay(post._id, currentMediaIdx)
                        }
                        className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                          {isVideoPlaying ? (
                            <Pause className="w-8 h-8 text-gray-800" />
                          ) : (
                            <Play className="w-8 h-8 text-gray-800 ml-1" />
                          )}
                        </div>
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Media Navigation */}
              {post.workMedia.length > 1 && (
                <>
                  <button
                    onClick={() => navigateMedia(post._id, "prev")}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigateMedia(post._id, "next")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Media Indicators */}
              {post.workMedia.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {post.workMedia.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() =>
                        setCurrentMediaIndex((prev) => ({
                          ...prev,
                          [post._id]: idx,
                        }))
                      }
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === currentMediaIdx ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Price Overlay */}
              <div className="absolute top-4 right-4">
                <div className="bg-green-600/90 backdrop-blur-sm text-white px-3 py-2 rounded-xl font-semibold">
                  {formatPrice(post.price)}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(post._id)}
                  className={`flex items-center gap-2 transition-colors ${
                    post.isLiked
                      ? "text-red-500"
                      : "text-gray-400 hover:text-red-500"
                  }`}
                >
                  <Heart
                    className={`w-6 h-6 ${post.isLiked ? "fill-current" : ""}`}
                  />
                  <span className="text-sm font-medium">{post.likesCount}</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedPostId(post._id);
                    setSelectedPostTitle(post.title);
                    setShowComments(true);
                  }}
                  className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-sm font-medium">
                    {post.commentsCount}
                  </span>
                </button>

                <button className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors">
                  <Share2 className="w-6 h-6" />
                  <span className="text-sm font-medium">
                    {post.sharesCount}
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handlePayNow(post)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  Pay Now
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                  <Eye className="w-5 h-5" />
                  <span className="text-sm">View Details</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-white">
                  {post.creator.firstName}
                </span>
                <span className="text-gray-300">{post.title}</span>
              </div>

              <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                {post.description}
              </p>

              {/* Skills */}
              {post.skills && post.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.skills.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-white/10 text-white text-xs rounded-full border border-white/20"
                    >
                      {skill}
                    </span>
                  ))}
                  {post.skills.length > 3 && (
                    <span className="px-2 py-1 bg-white/10 text-white text-xs rounded-full border border-white/20">
                      +{post.skills.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Delivery Info */}
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(post.deliveryDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      )}

      {/* End of Feed */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">
            You&apos;ve reached the end of the feed
          </p>
        </div>
      )}

      {/* Real-time Messaging Modal */}
      <RealtimeMessaging
        isOpen={showMessaging}
        onClose={() => {
          setShowMessaging(false);
          setSelectedUserId(null);
        }}
        recipientId={selectedUserId || undefined}
      />

      {/* Real-time Comments Modal */}
      <RealtimeComments
        isOpen={showComments}
        onClose={() => {
          setShowComments(false);
          setSelectedPostId(null);
          setSelectedPostTitle("");
        }}
        postId={selectedPostId || ""}
        postTitle={selectedPostTitle}
      />

      {/* AI Freelancer Insights Trigger */}
      {currentFreelancer && (
        <FreelancerInsightsTrigger
          freelancerData={currentFreelancer}
          onContactFreelancer={() => {
            setSelectedUserId(currentFreelancer._id);
            setShowMessaging(true);
          }}
          triggerDelay={5000} // Show after 5 seconds of viewing
        />
      )}
    </div>
  );
};

export default SocialMarketplaceFeed;
