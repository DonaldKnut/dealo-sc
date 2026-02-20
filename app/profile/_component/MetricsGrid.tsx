"use client";

import React from "react";
import {
  Coins,
  Briefcase,
  Package,
  Award,
  Heart,
  ShoppingCart,
} from "lucide-react";

interface MetricsGridProps {
  credits: number;
  jobs: number;
  orders: number;
  bids: number;
  wishlist: number;
  cartItems: number;
}

const metrics = [
  { key: "credits", label: "Credits", value: 0, icon: Coins },
  { key: "jobs", label: "Jobs", value: 0, icon: Briefcase },
  { key: "orders", label: "Orders", value: 0, icon: Package },
  { key: "bids", label: "Bids", value: 0, icon: Award },
  { key: "wishlist", label: "Wishlist", value: 0, icon: Heart },
  { key: "cartItems", label: "Cart", value: 0, icon: ShoppingCart },
];

const MetricsGrid: React.FC<MetricsGridProps> = ({
  credits,
  jobs,
  orders,
  bids,
  wishlist,
  cartItems,
}) => {
  const values = { credits, jobs, orders, bids, wishlist, cartItems };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {metrics.map(({ key, label, icon: Icon }) => (
        <div
          key={key}
          className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/30 transition-all duration-300 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/40">
                {label}
              </p>
              <p className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">
                {values[key as keyof typeof values]}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsGrid;
