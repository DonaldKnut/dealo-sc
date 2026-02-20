"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, ChevronRight, ChevronLeft, Book,
  ArrowLeft, Search, Command
} from "lucide-react";
import type { DocsNavItem } from "@/constants/docsNav";

interface DocsLayoutProps {
  nav: DocsNavItem[];
  children: React.ReactNode;
}

export default function DocsLayout({ nav, children }: DocsLayoutProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans">
      {/* ── AMBIENT BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-green-500/5 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none" />
      </div>

      {/* ── FIXED SIDEBAR ── */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 288 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 bottom-0 hidden lg:flex flex-col bg-black/40 backdrop-blur-2xl border-r border-white/5 z-40 overflow-hidden"
      >
        {/* COLLAPSE TOGGLE */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-4 top-8 z-[100] w-8 h-8 rounded-full bg-[#0a0a0a] border border-emerald-500/40 flex items-center justify-center text-white hover:bg-emerald-500/20 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] active:scale-90"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* LOGO AREA */}
        <div className={`p-8 border-b border-white/5 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 group'}`}>
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex-shrink-0 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-transform hover:scale-110">
              <Book className="w-5 h-5 text-black" />
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <span className="text-sm font-black uppercase tracking-[0.2em] whitespace-nowrap">Dealo</span>
                <span className="block text-[8px] font-black uppercase tracking-[0.3em] text-emerald-500 whitespace-nowrap">Documentation</span>
              </motion.div>
            )}
          </Link>
        </div>

        {/* SEARCH BAR */}
        {!isCollapsed ? (
          <div className="px-6 py-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-hover:text-emerald-500 transition-colors" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-bold text-white/30">
                <Command className="w-2.5 h-2.5" /> K
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-6">
            <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:text-emerald-500 hover:border-emerald-500/30 transition-all">
              <Search className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* NAVIGATION */}
        <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'px-0' : 'px-6'} py-4 custom-scrollbar`}>
          <DocsNavItems nav={nav} pathname={pathname} isCollapsed={isCollapsed} />
        </div>

        {/* BOTTOM ACTION */}
        <div className="p-6 border-t border-white/5 flex justify-center">
          <Link href="/" className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors group`}>
            <ArrowLeft className={`w-4 h-4 group-hover:-translate-x-1 transition-transform ${!isCollapsed ? '' : 'mx-auto'}`} />
            {!isCollapsed && <span className="whitespace-nowrap">Back to Platform</span>}
          </Link>
        </div>
      </motion.aside>

      {/* ── MOBILE HEADER (SAME) ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black/60 backdrop-blur-xl border-b border-white/5 z-40 flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
            <Book className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.2em]">Dealo Docs</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* ── MAIN CONTENT ── */}
      <motion.main
        initial={false}
        animate={{ marginLeft: isCollapsed ? 80 : 288 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative z-10 min-h-screen flex flex-col pt-16 lg:pt-0"
      >
        <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 lg:px-12 lg:py-20 flex flex-col">
          {children}
        </div>
      </motion.main>

      {/* ── MOBILE DRAWER (SAME) ── */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-[#0a0a0a] border-r border-white/10 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-500">Navigation</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <DocsNavItems nav={nav} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DocsNavItems({
  nav,
  pathname,
  onNavigate,
  isCollapsed = false,
}: {
  nav: DocsNavItem[];
  pathname: string;
  onNavigate?: () => void;
  isCollapsed?: boolean;
}) {
  return (
    <nav className={`space-y-6 ${isCollapsed ? 'px-3' : ''}`}>
      {nav.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/docs" && pathname.startsWith(item.href));

        const Icon = item.icon;

        return (
          <div key={item.href} className="space-y-3">
            <Link
              href={item.href}
              onClick={onNavigate}
              title={isCollapsed ? item.title : undefined}
              className={`group flex items-center transition-all ${isCollapsed ? 'justify-center' : 'justify-between'
                } ${isActive ? "text-emerald-400" : "text-white/40 hover:text-white"}`}
            >
              <div className="flex items-center gap-3">
                {Icon && (
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-all ${isActive ? "text-emerald-400" : "text-white/20 group-hover:text-emerald-400"
                    }`} />
                )}
                {!isCollapsed && (
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
                    {item.title}
                  </span>
                )}
              </div>

              {!isCollapsed && isActive && (
                <motion.div
                  layoutId="docsActive"
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                />
              )}
            </Link>

            {item.children && !isCollapsed && (
              <div className="space-y-1 ml-1 border-l border-white/5 pl-4">
                {item.children.map((child) => {
                  const isChildActive = pathname === child.href;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onNavigate}
                      className={`block py-1.5 text-xs font-bold transition-all ${isChildActive
                        ? "text-emerald-400 translate-x-1"
                        : "text-white/20 hover:text-white/60 hover:translate-x-0.5"
                        }`}
                    >
                      {child.title}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
