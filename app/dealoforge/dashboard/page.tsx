"use client";

// Client-side component - no need for force-dynamic

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  BookOpen,
  Users,
  Settings,
  BarChart3,
  MessageSquare,
  Bell,
  Calendar,
  Award,
  Briefcase,
  TrendingUp,
  Target,
  Star,
  Clock,
  CheckCircle,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  HardDrive,
  FileText,
  UsersRound,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useSafeSession } from "@/hooks/use-safe-session";
import EmptyState from "@/components/EmptyState";

// Import all the page components
import CoursesPage from "./components/CoursesPage";
import NetworkPage from "./components/NetworkPage";
import MessagesPage from "./components/MessagesPage";
import AnalyticsPage from "./components/AnalyticsPage";
import CertificationsPage from "./components/CertificationsPage";
import CalendarPage from "./components/CalendarPage";
import JobsPage from "./components/JobsPage";
import SettingsPage from "./components/SettingsPage";
import DrivePage from "@/app/dealoforge/dashboard/components/DrivePage";
import ResumeBuilderPage from "@/app/dealoforge/dashboard/components/ResumeBuilderPage";
import HireTalentPage from "@/app/dealoforge/dashboard/components/HireTalentPage";
import TeamInvitePage from "@/app/dealoforge/dashboard/components/TeamInvitePage";
import CreateCourseModal from "@/app/dealoforge/dashboard/components/CreateCourseModal";

type PageType =
  | "home"
  | "courses"
  | "network"
  | "messages"
  | "analytics"
  | "certifications"
  | "calendar"
  | "jobs"
  | "settings"
  | "drive"
  | "resume-builder"
  | "hire-talent"
  | "team-invite";

const DashboardPage = () => {
  const [activePage, setActivePage] = useState<PageType>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  const session = useSafeSession();
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    if (saved !== null) {
      setSidebarCollapsed(saved === "true");
    }
  }, []);

  const closeMobileMenu = () => {
    setSidebarOpen(false);
    setMobileMenuOpen(false);
  };

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", String(newState));
  };

  const navigationItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "courses", label: "My Courses", icon: BookOpen },
    { id: "network", label: "Network", icon: Users },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "drive", label: "My Drive", icon: HardDrive },
    { id: "jobs", label: "Jobs", icon: Briefcase },
    { id: "resume-builder", label: "Resume Builder", icon: FileText },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "hire-talent", label: "Hire Talent", icon: UsersRound },
  ];

  const [stats, setStats] = useState([
    { title: "Courses completed", value: "0", icon: BookOpen },
    { title: "Certifications", value: "0", icon: Award },
    { title: "Connections", value: "0", icon: Users },
    { title: "Job applications", value: "0", icon: Briefcase },
  ]);

  const [recentActivity, setRecentActivity] = useState<
    { id: number | string; title: string; time: string; icon: any }[]
  >([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/dashboard/overview", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setStats([
          { title: "Courses completed", value: String(data?.stats?.coursesCompleted ?? 0), icon: BookOpen },
          { title: "Certifications", value: String(data?.stats?.certifications ?? 0), icon: Award },
          { title: "Connections", value: String(data?.stats?.connections ?? 0), icon: Users },
          { title: "Job applications", value: String(data?.stats?.jobApplications ?? 0), icon: Briefcase },
        ]);
        const activity = (data?.recentActivity || []).map((a: any, idx: number) => ({
          id: a.id ?? idx,
          title: a.title,
          time: "JUST NOW",
          icon: a.type === "job" ? Briefcase : a.type === "network" ? Users : CheckCircle,
        }));
        setRecentActivity(activity);
      } catch (e) { }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return (
          <div className="space-y-12">
            {/* ── GREETING HERO ── */}
            <section className="relative group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-[9px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-6 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                  <Target className="w-3 h-3" />
                  You're all set
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] uppercase mb-4">
                  Welcome back, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600">
                    {session?.data?.user?.name?.split(" ")[0] || "there"}
                  </span>
                </h1>
                <p className="text-white/30 font-bold uppercase tracking-[0.25em] text-xs md:text-sm max-w-xl leading-relaxed">
                  Here's your overview. Track your courses, connections, and job activity.
                </p>
              </motion.div>
            </section>

            {/* ── STATS GRID ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-1 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:border-emerald-500/40 transition-all duration-500 group shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
                    <div className="p-8 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="h-6 w-px bg-white/10" />
                        <TrendingUp className="w-4 h-4 text-emerald-500/40 group-hover:text-emerald-400" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">{stat.title}</p>
                        <p className="text-3xl font-black text-white group-hover:text-emerald-400 transition-colors">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-2 p-px rounded-[2.5rem] bg-white/[0.03] border border-white/[0.1] shadow-2xl"
              >
                <div className="bg-black/40 backdrop-blur-3xl p-10 rounded-[2.45rem] h-full">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-black text-white uppercase tracking-widest">Recent activity</h3>
                    <div className="h-px flex-1 mx-6 bg-white/5" />
                    <Link href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
                      <Plus className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="space-y-6">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity, idx) => {
                        const Icon = activity.icon;
                        return (
                          <div key={activity.id} className="flex items-center gap-6 group">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 group-hover:border-emerald-500/30 group-hover:text-emerald-500 transition-all">
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-bold text-white uppercase tracking-wider group-hover:text-emerald-400 transition-colors">
                                {activity.title}
                              </h4>
                              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">{activity.time}</p>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all" />
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-20 text-center">
                        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                          <Clock className="w-10 h-10 text-white/10" />
                        </div>
                        <p className="text-white/20 font-black uppercase tracking-widest text-xs">No activity yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Quick Hub */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-6"
              >
                <div className="p-px rounded-[2.5rem] bg-emerald-500/20 border border-emerald-500/30 shadow-2xl">
                  <div className="bg-emerald-500 p-8 rounded-[2.45rem]">
                    <Sparkles className="w-8 h-8 text-black mb-6" />
                    <h3 className="text-2xl font-black text-black uppercase tracking-tighter leading-none mb-2">Go <br />Pro</h3>
                    <p className="text-black/60 text-xs font-bold uppercase tracking-wider mb-8">Get advanced analytics and priority support.</p>
                    <button className="w-full py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-neutral-900 transition-all shadow-xl">
                      Upgrade to Pro
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "EXPLORE", icon: Globe, color: "hover:text-blue-400" },
                    { label: "RANKINGS", icon: Target, color: "hover:text-red-400" },
                    { label: "SUPPORT", icon: MessageSquare, color: "hover:text-emerald-400" },
                    { label: "LEGAL", icon: ShieldCheck, color: "hover:text-amber-400" },
                  ].map((btn, i) => (
                    <button key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:border-white/20 transition-all group">
                      <btn.icon className={`w-5 h-5 text-white/20 group-hover:scale-110 transition-all ${btn.color}`} />
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mt-3 group-hover:text-white transition-colors">{btn.label}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        );
      case "courses": return <CoursesPage />;
      case "network": return <NetworkPage />;
      case "messages": return <MessagesPage />;
      case "analytics": return <AnalyticsPage />;
      case "certifications": return <CertificationsPage />;
      case "calendar": return <CalendarPage />;
      case "jobs": return <JobsPage />;
      case "settings": return <SettingsPage />;
      case "drive": return <DrivePage />;
      case "resume-builder": return <ResumeBuilderPage />;
      case "hire-talent": return <HireTalentPage />;
      case "team-invite": return <TeamInvitePage />;
      default: return <div className="text-white">Page not found</div>;
    }
  };

  const mobileNavItems: { id: PageType; label: string; icon: typeof Home }[] = [
    { id: "home", label: "Home", icon: Home },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "network", label: "Network", icon: Users },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "jobs", label: "Jobs", icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0f0a] to-black selection:bg-emerald-500/30 font-sans overflow-hidden flex flex-col lg:block">
      {/* ── PREMIUM AMBIENT BACKGROUND (matches home / sign-in) ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/[0.04] rounded-full blur-[150px] -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-900/[0.06] rounded-full blur-[120px] -ml-20 -mb-20" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.18] brightness-100 contrast-150" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
      </div>

      {/* Mobile Header — fixed so always visible above bottom nav */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-[60] bg-black/70 backdrop-blur-2xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="https://res.cloudinary.com/dxojy40bv/image/upload/v1755825606/DEALO_ICON_utffca.png" alt="Dealo" width={28} height={28} className="rounded-lg" />
          <span className="text-sm font-black text-white tracking-widest uppercase hidden xs:inline">DEALO</span>
        </Link>
        <button onClick={() => { setSidebarOpen(true); setMobileMenuOpen(true); }} className="text-white p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors" aria-label="Open menu">
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Spacer for fixed mobile header */}
      <div className="lg:hidden h-14 flex-shrink-0" aria-hidden="true" />

      <div className="flex flex-1 min-h-0 lg:h-screen relative z-10">
        {/* Mobile overlay: behind sidebar so sidebar stays tappable */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[45]"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        {/* Sidebar: above overlay on mobile */}
        <motion.aside
          initial={false}
          animate={{ width: sidebarCollapsed ? "100px" : "300px" }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 fixed lg:sticky lg:top-0 lg:h-screen inset-y-0 left-0 z-[50] bg-[#050505]/80 backdrop-blur-3xl border-r border-white/5 flex flex-col`}
        >
          {/* Logo Section */}
          <div className="flex items-center justify-between p-8 border-b border-white/5">
            {!sidebarCollapsed && (
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="https://res.cloudinary.com/dxojy40bv/image/upload/v1755825606/DEALO_ICON_utffca.png"
                  alt="Dealo"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <span className="text-xl font-black text-white tracking-widest uppercase">
                  DEALO
                </span>
              </Link>
            )}
            <button onClick={toggleSidebar} className="hidden lg:flex w-8 h-8 items-center justify-center text-white/20 hover:text-emerald-500 transition-colors">
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-3 overflow-y-auto no-scrollbar">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActivePage(item.id as PageType); closeMobileMenu(); }}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${isActive
                    ? "bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                  )}
                  {isActive && !sidebarCollapsed && (
                    <motion.div layoutId="active-pill" className="absolute right-4 w-1.5 h-1.5 rounded-full bg-black" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer Navigation */}
          <div className="p-6 border-t border-white/5 space-y-4">
            <Link
              href="/dealoforge/dashboard/upgrade"
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400/90 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all ${sidebarCollapsed ? "justify-center" : ""}`}
            >
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Upgrade to Pro</span>
              )}
            </Link>
            <button
              onClick={() => { setActivePage("settings"); closeMobileMenu(); }}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-white/30 hover:text-white transition-all ${sidebarCollapsed ? "justify-center" : ""}`}
            >
              <Settings className="w-5 h-5" />
              {!sidebarCollapsed && <span className="text-[10px] font-black uppercase tracking-[0.2em]">Settings</span>}
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-white/30 hover:text-red-500 transition-all ${sidebarCollapsed ? "justify-center" : ""}`}
            >
              <LogOut className="w-5 h-5" />
              {!sidebarCollapsed && <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sign out</span>}
            </button>
          </div>
        </motion.aside>

        {/* Content Area — extra bottom padding on mobile for bottom nav */}
        <main className="flex-1 overflow-y-auto p-6 pb-24 md:p-12 no-scrollbar lg:pl-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden flex-shrink-0 fixed bottom-0 left-0 right-0 z-[55] bg-black/90 backdrop-blur-3xl border-t border-white/5">
        <div className="flex items-center justify-around h-16 px-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 py-2 transition-colors ${isActive ? "text-emerald-400" : "text-white/50 hover:text-white/80"}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-[10px] font-medium truncate w-full text-center">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <CreateCourseModal isOpen={isCreateCourseModalOpen} onClose={() => setIsCreateCourseModalOpen(false)} />
    </div>
  );
};

export default DashboardPage;
