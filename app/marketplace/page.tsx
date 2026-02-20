"use client";

// Client-side component - no need for force-dynamic
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import SocialMarketplaceFeed from "./_components/SocialMarketplaceFeed";
import LeftSidebar from "./_components/LeftSidebar";
import RightSidebar from "./_components/RightSidebar";
import MobileMarketplace from "./_components/MobileMarketplace";
import ProductUploadModal from "./_components/ProductUploadModal";
import RoleSelectionModal from "./_components/RoleSelectionModal";
import { IWork } from "@/types";
import { Plus, Search, Filter } from "lucide-react";
import { useSafeSession } from "@/hooks/use-safe-session";

const MarketplacePage = () => {
  const [works, setWorks] = useState<IWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSafeSession();

  const checkUserRole = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch("/api/users/roles");
      if (response.ok) {
        const data = await response.json();
        if (!data.role) {
          setShowRoleModal(true);
        }
      }
    } catch (error) {
      console.error("Failed to check user role:", error);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchWorks();
    checkUserRole();
  }, [checkUserRole]);

  const fetchWorks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/work/all?limit=20");
      const result = await response.json();

      if (result.success) {
        setWorks(result.data);
      } else {
        console.error("Failed to fetch works:", result.message);
      }
    } catch (error) {
      console.error("Failed to fetch work list:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      {/* Background Cinematic Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-green-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-emerald-500/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[10%] left-[20%] w-[35%] h-[35%] bg-green-600/5 blur-[110px] rounded-full" />
      </div>

      {/* Mobile Version */}
      <MobileMarketplace works={works} />

      {/* Desktop Version */}
      <div className="hidden lg:block relative z-10">
        {/* Top Navigation - Ultra Premium */}
        <div className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5 py-4">
          <div className="max-w-[1600px] mx-auto px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col"
                >
                  <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-green-400 tracking-tighter">
                    MARKETPLACE
                  </h1>
                  <span className="text-[10px] font-bold text-green-500 tracking-[0.3em] uppercase opacity-70">
                    Talent Ecosystem
                  </span>
                </motion.div>

                <div className="relative group">
                  <motion.div
                    initial={{ width: 300, opacity: 0 }}
                    animate={{ width: 450, opacity: 1 }}
                    className="relative"
                  >
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500/50 w-5 h-5 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                      type="text"
                      placeholder="Search services, skills, or top freelancers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-6 py-3.5 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/[0.05] transition-all duration-300 text-sm xl:text-base shadow-2xl"
                    />
                  </motion.div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-white/[0.03] hover:bg-white/[0.08] text-white/80 hover:text-white rounded-2xl border border-white/10 transition-all duration-300 font-medium"
                >
                  <Filter className="w-4 h-4 text-emerald-400" />
                  Filters
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-2xl transition-all duration-500 font-bold shadow-lg shadow-green-900/40 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <Plus className="w-5 h-5" />
                  Post Service
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout - Cinematic Spacing */}
        <div className="max-w-[1600px] mx-auto px-8 py-10">
          <div className="flex gap-10 items-start">
            {/* Left Sidebar - Sticky & Premium */}
            <aside className="w-[320px] sticky top-28 h-[calc(100vh-140px)] overflow-y-auto no-scrollbar pb-10">
              <LeftSidebar />
            </aside>

            {/* Main Feed - Centered & Dynamic */}
            <main className="flex-1 min-w-0 pb-20">
              <SocialMarketplaceFeed initialPosts={works} />
            </main>

            {/* Right Sidebar - Sticky & Elite */}
            <aside className="hidden xl:block w-[360px] sticky top-28 h-[calc(100vh-140px)] overflow-y-auto no-scrollbar pb-10">
              <RightSidebar />
            </aside>
          </div>
        </div>
      </div>

      {/* Modals with Premium Overlay */}
      <ProductUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />

      <RoleSelectionModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onRoleSelected={(role, title) => {
          console.log("Role selected:", role, title);
          setShowRoleModal(false);
        }}
      />
    </div>
  );
};

export default MarketplacePage;
