"use client";

import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Search,
  Menu,
  X,
  User,
  Bell,
  MessageCircle,
  BookOpen,
  Briefcase,
  Users,
  LogOut,
  Settings,
  ChevronDown,
  ChevronRight,
  Zap,
  Globe,
  Shield,
  CreditCard,
  Video,
  Building,
  GraduationCap,
  Heart,
  Target,
  Lightbulb,
  Code,
  ArrowRight,
  Star,
  TrendingUp,
  Palette,
  Megaphone,
  BarChart3,
  Cpu,
  DollarSign,
  CheckCircle,
  Clock,
  Award,
  Rocket,
  Sparkles,
  ExternalLink,
  ArrowUpRight,
  PenTool,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSafeSession } from "@/hooks/use-safe-session";
import NotificationModal from "@/components/NotificationModal";

const NAVIGATION_ITEMS = [
  {
    name: "Products",
    href: "#",
    hasMegaMenu: true,
    leadingIcon: <Sparkles className="w-3.5 h-3.5" />,
    megaMenuItems: [
      {
        title: "Learning Platform",
        description: "AI-powered courses and certifications",
        href: "/certifications/explore",
        icon: <GraduationCap className="w-5 h-5" />,
        features: ["AI Assessment", "Industry Recognition", "Flexible Learning"],
        color: "from-emerald-400 to-emerald-600",
        illustration: "🎓",
      },
      {
        title: "Freelance Marketplace",
        description: "Find and offer professional services",
        href: "/search/freelance",
        icon: <Briefcase className="w-5 h-5" />,
        features: ["Secure Payments", "Project Management", "Client Matching"],
        color: "from-green-400 to-green-600",
        illustration: "💼",
      },
      {
        title: "Professional Network",
        description: "Connect with industry experts",
        href: "/search/professionals",
        icon: <Users className="w-5 h-5" />,
        features: ["Expert Directory", "Mentorship", "Collaboration"],
        color: "from-teal-400 to-teal-600",
        illustration: "🤝",
      },
      {
        title: "Social Platform",
        description: "Share your work and achievements",
        href: "/social/feed",
        icon: <Heart className="w-5 h-5" />,
        features: ["Portfolio Showcase", "Community", "Recognition"],
        color: "from-emerald-500 to-green-700",
        illustration: "❤️",
      },
    ],
  },
  {
    name: "Solutions",
    href: "#",
    hasMegaMenu: true,
    leadingIcon: <Target className="w-3.5 h-3.5" />,
    megaMenuItems: [
      {
        title: "For Individuals",
        description: "Learn, earn, and grow your career",
        href: "/solutions/individuals",
        icon: <User className="w-5 h-5" />,
        features: ["Skill Development", "Income Generation", "Career Growth"],
        color: "from-green-300 to-green-500",
        illustration: "👤",
      },
      {
        title: "For Businesses",
        description: "Find talent and scale your operations",
        href: "/solutions/businesses",
        icon: <Building className="w-5 h-5" />,
        features: ["Talent Acquisition", "Project Outsourcing", "Team Building"],
        color: "from-emerald-400 to-emerald-600",
        illustration: "🏢",
      },
      {
        title: "Find Jobs",
        description: "Browse thousands of job opportunities",
        href: "/jobs",
        icon: <Briefcase className="w-5 h-5" />,
        features: ["Job Search", "Featured Listings", "Apply Now"],
        color: "from-blue-400 to-blue-600",
        illustration: "💼",
      },
      {
        title: "Bulk Hiring & Outsourcing",
        description: "Hire teams and outsource projects at scale",
        href: "/employment/bulk-hiring",
        icon: <Users className="w-5 h-5" />,
        features: ["Team Recruitment", "Project-Based Hiring", "Scalable Solutions"],
        color: "from-green-500 to-green-700",
        illustration: "👥",
      },
      {
        title: "Pricing Plans",
        description: "Flexible plans for your needs",
        href: "/pricing",
        icon: <DollarSign className="w-5 h-5" />,
        features: ["Free Trial", "Flexible Plans", "No Hidden Fees"],
        color: "from-gray-400 to-gray-600",
        illustration: "💳",
      },
      {
        title: "For Instructors",
        description: "Create and monetize your courses",
        href: "/solutions/instructors",
        icon: <BookOpen className="w-5 h-5" />,
        features: ["Course Creation", "Revenue Sharing", "Analytics"],
        color: "from-green-500 to-green-700",
        illustration: "📚",
      },
    ],
  },
  {
    name: "Courses",
    href: "/courses",
    hasMegaMenu: false,
    leadingIcon: <BookOpen className="w-3.5 h-3.5" />,
  },
  {
    name: "Resources",
    href: "#",
    hasMegaMenu: true,
    leadingIcon: <BookOpen className="w-3.5 h-3.5" />,
    megaMenuItems: [
      {
        title: "Video Chat",
        description: "Professional video meetings and collaboration",
        href: "/features/video-chat",
        icon: <Video className="w-5 h-5" />,
        features: ["HD Video Calls", "Screen Sharing", "Recording"],
        color: "from-blue-400 to-blue-600",
        illustration: "📹",
      },
      {
        title: "Travel Loans",
        description: "Finance your travel and education goals",
        href: "/features/travel-loans",
        icon: <DollarSign className="w-5 h-5" />,
        features: ["Quick Approval", "Flexible Repayment", "Low Rates"],
        color: "from-green-500 to-green-700",
        illustration: "✈️",
      },
      {
        title: "Scratch Cards",
        description: "Win rewards and discounts on courses",
        href: "/features/scratch-cards",
        icon: <Sparkles className="w-5 h-5" />,
        features: ["Instant Rewards", "Course Discounts", "Cash Prizes"],
        color: "from-yellow-400 to-orange-600",
        illustration: "🎫",
      },
      {
        title: "Documentation",
        description: "Learn how to use our platform",
        href: "/docs",
        icon: <BookOpen className="w-5 h-5" />,
        features: ["API Guides", "Tutorials", "Best Practices"],
        color: "from-green-600 to-green-800",
        illustration: "📖",
      },
      {
        title: "API Reference",
        description: "Integrate with our services",
        href: "/api",
        icon: <Code className="w-5 h-5" />,
        features: ["REST API", "SDKs", "Webhooks"],
        color: "from-green-700 to-green-900",
        illustration: "⚡",
      },
      {
        title: "Community",
        description: "Join our community forum",
        href: "/community",
        icon: <Users className="w-5 h-5" />,
        features: ["Discussions", "Support", "Events"],
        color: "from-green-800 to-green-950",
        illustration: "🌐",
      },
    ],
  },
  {
    name: "Blog",
    href: "#",
    hasMegaMenu: true,
    leadingIcon: <BookOpen className="w-3.5 h-3.5" />,
    megaMenuItems: [
      {
        title: "Latest Articles",
        description: "Stay updated with industry trends and insights",
        href: "/blog",
        icon: <BookOpen className="w-5 h-5" />,
        features: ["Industry News", "Expert Insights", "Trending Topics"],
        color: "from-blue-400 to-blue-600",
        illustration: "📰",
      },
      {
        title: "Career Tips",
        description: "Professional development and career advice",
        href: "/blog/career-tips",
        icon: <Target className="w-5 h-5" />,
        features: ["Career Growth", "Skill Development", "Job Search"],
        color: "from-green-400 to-green-600",
        illustration: "🎯",
      },
      {
        title: "Tech Insights",
        description: "Technology trends and development guides",
        href: "/blog/tech-insights",
        icon: <Code className="w-5 h-5" />,
        features: ["Programming", "AI/ML", "Web Development"],
        color: "from-purple-400 to-purple-600",
        illustration: "💻",
      },
      {
        title: "Success Stories",
        description: "Real stories from our community members",
        href: "/blog/success-stories",
        icon: <Star className="w-5 h-5" />,
        features: ["Case Studies", "Testimonials", "Inspiration"],
        color: "from-yellow-400 to-orange-600",
        illustration: "⭐",
      },
      {
        title: "Write for Us",
        description: "Share your expertise and contribute to our blog",
        href: "/writers/signup",
        icon: <PenTool className="w-5 h-5" />,
        features: ["Guest Posts", "Expert Content", "Community Contribution"],
        color: "from-indigo-400 to-indigo-600",
        illustration: "✍️",
      },
    ],
  },
];

const Header = () => {
  const session = useSafeSession();
  const { data: sessionData, status } = session || {};
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const megaMenuTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!sessionData?.user?.id) return;
      try {
        const res = await fetch("/api/notifications?unreadOnly=true&limit=1");
        if (res.ok) {
          const data = await res.json();
          setUnreadNotificationCount(data.unreadCount || 0);
        }
      } catch { }
    };
    if (sessionData?.user?.id) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [sessionData?.user?.id]);

  const handleSignOut = async () => {
    try {
      setActiveMegaMenu(null);
      setIsMenuOpen(false);
      setIsSearchOpen(false);
      const loadingToast = toast.loading("Signing out safely...");
      await signOut({ redirect: false });
      toast.dismiss(loadingToast);
      // Force full reload so session cookie and client state are cleared
      window.location.href = "/sign-in";
    } catch {
      toast.error("Failed to sign out. Please try again.");
      window.location.href = "/sign-in";
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search/${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleMegaMenuEnter = (name: string) => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setActiveMegaMenu(name);
  };

  const handleMegaMenuLeave = () => {
    megaMenuTimeout.current = setTimeout(() => setActiveMegaMenu(null), 120);
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled
        ? "bg-black/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_1px_40px_rgba(0,0,0,0.6)]"
        : "bg-transparent"
        }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[68px]">

          {/* ── LOGO ── */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Image
                src="https://res.cloudinary.com/dxojy40bv/image/upload/v1755825606/DEALO_ICON_utffca.png"
                alt="Dealo"
                width={40}
                height={40}
                className="w-9 h-9 lg:w-10 lg:h-10 relative"
              />
            </div>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAVIGATION_ITEMS.map((item) => (
              <div key={item.name} className="relative">
                {item.hasMegaMenu ? (
                  <div
                    onMouseEnter={() => handleMegaMenuEnter(item.name)}
                    onMouseLeave={handleMegaMenuLeave}
                  >
                    <button
                      className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeMegaMenu === item.name
                        ? "text-emerald-400 bg-emerald-500/10"
                        : "text-gray-300 hover:text-white hover:bg-white/[0.06]"
                        }`}
                    >
                      <span className={`transition-colors ${activeMegaMenu === item.name ? "text-emerald-400" : "text-gray-500"}`}>
                        {item.leadingIcon}
                      </span>
                      <span>{item.name}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMegaMenu === item.name ? "rotate-180 text-emerald-400" : "text-gray-600"
                          }`}
                      />
                    </button>

                    {/* ── MEGA MENU ── */}
                    <AnimatePresence>
                      {activeMegaMenu === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                          className={`absolute top-full mt-3 z-[110] ${item.name === "Blog" || item.name === "Resources"
                              ? "right-0"
                              : "left-1/2 -translate-x-1/2"
                            }`}
                          onMouseEnter={() => handleMegaMenuEnter(item.name)}
                          onMouseLeave={handleMegaMenuLeave}
                        >
                          {/* Arrow */}
                          <div className={`absolute -top-1.5 w-3 h-3 bg-[#0d1a0d] border-l border-t border-emerald-500/20 rotate-45 ${item.name === "Blog" || item.name === "Resources"
                              ? "right-8"
                              : "left-1/2 -translate-x-1/2"
                            }`} />

                          <div className="relative bg-[#080f08] border border-white/[0.08] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden"
                            style={{ width: item.megaMenuItems && item.megaMenuItems.length > 4 ? 560 : 480 }}
                          >
                            {/* Top accent line */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

                            <div className="p-5">
                              <div className={`grid gap-2 ${item.megaMenuItems && item.megaMenuItems.length > 4 ? "grid-cols-2" : "grid-cols-2"}`}>
                                {item.megaMenuItems?.map((menuItem, index) => (
                                  <Link
                                    key={menuItem.title}
                                    href={menuItem.href}
                                    className="group/item flex items-start gap-3.5 p-3 rounded-xl border border-transparent hover:border-emerald-500/20 hover:bg-emerald-500/[0.06] transition-all duration-200 cursor-pointer"
                                    onClick={() => setActiveMegaMenu(null)}
                                  >
                                    {/* Icon */}
                                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${menuItem.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover/item:scale-110 transition-transform duration-300`}>
                                      <div className="text-white">{menuItem.icon}</div>
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-2 mb-0.5">
                                        <h3 className="text-[13px] font-semibold text-white group-hover/item:text-emerald-300 transition-colors truncate">
                                          {menuItem.title}
                                        </h3>
                                        <ArrowUpRight className="w-3 h-3 text-emerald-500 opacity-0 group-hover/item:opacity-100 flex-shrink-0 transition-all duration-200 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5" />
                                      </div>
                                      <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-1">
                                        {menuItem.description}
                                      </p>
                                      <div className="flex flex-wrap gap-1 mt-1.5">
                                        {menuItem.features.slice(0, 2).map((f, fi) => (
                                          <span key={fi} className="text-[10px] text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-md font-medium">
                                            {f}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>

                              {/* Bottom CTA */}
                              <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                                <div>
                                  {!sessionData?.user || status !== "authenticated" ? (
                                    <>
                                      <p className="text-[12px] font-semibold text-white">Ready to get started?</p>
                                      <p className="text-[11px] text-gray-500">Join thousands of professionals</p>
                                    </>
                                  ) : (
                                    <>
                                      <p className="text-[12px] font-semibold text-white">
                                        Welcome back, {sessionData?.user?.name?.split(" ")[0] || "there"}! 👋
                                      </p>
                                      <p className="text-[11px] text-gray-500">Continue your journey</p>
                                    </>
                                  )}
                                </div>
                                <Link
                                  href={!sessionData?.user || status !== "authenticated" ? "/sign-in" : "/dashboard"}
                                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-[12px] font-bold rounded-lg transition-all duration-200 shadow-lg shadow-emerald-900/30 hover:shadow-emerald-500/20 group/cta"
                                  onClick={() => setActiveMegaMenu(null)}
                                >
                                  {!sessionData?.user || status !== "authenticated" ? "Get Started" : "Dashboard"}
                                  <ArrowRight className="w-3.5 h-3.5 group-hover/cta:translate-x-0.5 transition-transform" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all duration-200"
                  >
                    <span className="text-gray-500">{item.leadingIcon}</span>
                    <span>{item.name}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* ── RIGHT SIDE ACTIONS ── */}
          <div className="flex items-center gap-1 lg:gap-2">

            {/* Search */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all duration-200"
              >
                <Search className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
              </button>

              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-3 w-80 bg-[#080f08] border border-white/[0.08] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.8)] p-4"
                  >
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent rounded-t-2xl" />
                    <form onSubmit={handleSearch} className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search courses, professionals, jobs..."
                          className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/40 transition-all"
                          autoFocus
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                      >
                        Search
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {sessionData?.user ? (
              <div className="flex items-center gap-1 lg:gap-2">
                {/* Notifications */}
                <button
                  onClick={() => setIsNotificationModalOpen(true)}
                  className="hidden lg:flex relative p-2 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all duration-200"
                >
                  <Bell style={{ width: 18, height: 18 }} />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </button>

                {/* Messages */}
                <Link
                  href="/messenger"
                  className="hidden lg:flex relative p-2 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all duration-200"
                >
                  <MessageCircle style={{ width: 18, height: 18 }} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setActiveMegaMenu(activeMegaMenu === "user" ? null : "user")}
                    className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/[0.06] transition-all duration-200 group"
                  >
                    <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-900/30">
                      <User className="w-3.5 h-3.5 text-black" />
                    </div>
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white hidden sm:block transition-colors max-w-[100px] truncate">
                      {sessionData?.user?.name?.split(" ")[0] || "Account"}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-600 hidden sm:block transition-transform duration-200 ${activeMegaMenu === "user" ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {activeMegaMenu === "user" && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-3 w-56 bg-[#080f08] border border-white/[0.08] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-white/[0.06]">
                          <p className="text-[13px] font-semibold text-white truncate">{sessionData?.user?.name}</p>
                          <p className="text-[11px] text-gray-500 truncate">{sessionData?.user?.email}</p>
                        </div>
                        <div className="p-2 space-y-0.5">
                          {[
                            { href: "/dealoforge/dashboard", icon: <User className="w-4 h-4" />, label: "Dashboard" },
                            { href: "/profile", icon: <Settings className="w-4 h-4" />, label: "Settings" },
                          ].map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              onClick={() => setActiveMegaMenu(null)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200 text-sm"
                            >
                              <span className="text-gray-500">{item.icon}</span>
                              {item.label}
                            </Link>
                          ))}
                          <div className="pt-1 mt-1 border-t border-white/[0.06]">
                            <button
                              onClick={handleSignOut}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 text-sm w-full"
                            >
                              <LogOut className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-bold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-900/30"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all duration-200"
            >
              {isMenuOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100dvh" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/95 backdrop-blur-2xl border-t border-white/[0.06] fixed inset-0 top-16 z-40 overflow-y-auto"
          >
            <div className="px-4 py-6 space-y-1 max-w-lg mx-auto">

              {/* Mobile user quick actions */}
              {sessionData?.user && (
                <div className="mb-6 p-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{sessionData?.user?.name}</p>
                      <p className="text-xs text-gray-500">{sessionData?.user?.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { icon: <Bell className="w-5 h-5" />, label: "Alerts", onClick: () => { setIsNotificationModalOpen(true); setIsMenuOpen(false); }, badge: unreadNotificationCount > 0 },
                      { icon: <MessageCircle className="w-5 h-5" />, label: "Messages", href: "/messenger" },
                      { icon: <User className="w-5 h-5" />, label: "Dashboard", href: "/dealoforge/dashboard" },
                      { icon: <Settings className="w-5 h-5" />, label: "Profile", href: "/profile" },
                    ].map((action, i) => (
                      action.href ? (
                        <Link
                          key={i}
                          href={action.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex flex-col items-center gap-1.5 p-3 bg-white/[0.04] hover:bg-emerald-500/10 border border-white/[0.06] hover:border-emerald-500/20 rounded-xl transition-all duration-200"
                        >
                          <span className="text-gray-400">{action.icon}</span>
                          <span className="text-[10px] text-gray-400 font-medium">{action.label}</span>
                        </Link>
                      ) : (
                        <button
                          key={i}
                          onClick={action.onClick}
                          className="relative flex flex-col items-center gap-1.5 p-3 bg-white/[0.04] hover:bg-emerald-500/10 border border-white/[0.06] hover:border-emerald-500/20 rounded-xl transition-all duration-200"
                        >
                          <span className="text-gray-400">{action.icon}</span>
                          <span className="text-[10px] text-gray-400 font-medium">{action.label}</span>
                          {action.badge && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                        </button>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile Search */}
              <div className="mb-4">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/40 transition-all"
                  />
                </form>
              </div>

              {/* Mobile Navigation Items */}
              {NAVIGATION_ITEMS.map((item) => (
                <div key={item.name}>
                  {item.hasMegaMenu ? (
                    <div>
                      <button
                        onClick={() => setActiveMegaMenu(activeMegaMenu === item.name ? null : item.name)}
                        className="flex items-center justify-between w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200 text-sm font-medium"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-gray-500">{item.leadingIcon}</span>
                          {item.name}
                        </span>
                        <ChevronRight className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${activeMegaMenu === item.name ? "rotate-90" : ""}`} />
                      </button>

                      <AnimatePresence>
                        {activeMegaMenu === item.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-4 mt-1 space-y-1 border-l border-emerald-500/20 pl-4 overflow-hidden"
                          >
                            {item.megaMenuItems?.map((menuItem, index) => (
                              <Link
                                key={menuItem.title}
                                href={menuItem.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] hover:border-emerald-500/20 border border-transparent transition-all duration-200 group/mob"
                              >
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${menuItem.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                                  <div className="text-white scale-75">{menuItem.icon}</div>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-white group-hover/mob:text-emerald-300 transition-colors">{menuItem.title}</p>
                                  <p className="text-[11px] text-gray-600">{menuItem.description}</p>
                                </div>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200 text-sm font-medium"
                    >
                      <span className="text-gray-500">{item.leadingIcon}</span>
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile CTA */}
              <div className="pt-4 pb-8 space-y-3">
                {sessionData?.user ? (
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-white/[0.04] border border-white/[0.08] hover:border-red-500/30 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-xl text-sm font-medium transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                ) : (
                  <Link
                    href="/sign-in"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-sm font-bold transition-all duration-200 shadow-lg shadow-emerald-900/30"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
    </motion.header>
  );
};

export default Header;
