"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Filter,
  Heart,
  MessageCircle,
  Share2,
  User,
  Bell,
  Menu,
} from "lucide-react";
import SocialMarketplaceFeed from "./SocialMarketplaceFeed";
import { IWork } from "@/types";

interface MobileMarketplaceProps {
  works: IWork[];
}

const MobileMarketplace: React.FC<MobileMarketplaceProps> = ({ works }) => {
  const [activeTab, setActiveTab] = useState("feed");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "feed", label: "Feed", icon: null },
    { id: "discover", label: "Discover", icon: null },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="lg:hidden">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">Marketplace</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Search className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Menu className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search services, skills, or freelancers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Mobile Tabs */}
        <div className="flex border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-green-400 border-b-2 border-green-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.icon && <tab.icon className="w-4 h-4" />}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Content */}
      <div className="pb-20">
        {activeTab === "feed" && <SocialMarketplaceFeed initialPosts={works} />}
        {activeTab === "discover" && (
          <div className="p-4">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Discover Services
              </h3>
              <p className="text-gray-400 text-sm">
                Find amazing freelancers and services
              </p>
            </div>
          </div>
        )}
        {activeTab === "messages" && (
          <div className="p-4">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Messages
              </h3>
              <p className="text-gray-400 text-sm">
                Connect with freelancers and clients
              </p>
            </div>
          </div>
        )}
        {activeTab === "profile" && (
          <div className="p-4">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Profile</h3>
              <p className="text-gray-400 text-sm">
                Manage your account and services
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-white/10 z-40">
        <div className="flex items-center justify-around py-2">
          <button className="flex flex-col items-center gap-1 p-2 text-green-400">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-medium">Post</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <Heart className="w-5 h-5" />
            <span className="text-xs">Wishlist</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs">Messages</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileMarketplace;
