"use client";

import { useSafeSession } from "@/hooks/use-safe-session";
import ProfileCard from "./_component/ProfileCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

const Profile = () => {
  const session = useSafeSession();
  const { data: sessionData } = session || {};
  const user = sessionData?.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0f0a] to-black selection:bg-emerald-500/30 font-sans overflow-x-hidden">
      {/* Premium ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/[0.04] rounded-full blur-[150px] -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-900/[0.06] rounded-full blur-[120px] -ml-20 -mb-20" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.18] brightness-100 contrast-150" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back + section badge */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/60 hover:text-emerald-400 transition-colors text-sm font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 w-fit">
              Your profile
            </span>
          </div>

          {/* Hero heading */}
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[0.95]">
              Profile
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600">
                {user?.name?.split(" ")[0] || "Dashboard"}
              </span>
            </h1>
            <p className="mt-4 text-white/40 font-medium text-sm md:text-base max-w-xl">
              Manage your identity, cover photo, and key metrics in one place.
            </p>
          </div>

          <ProfileCard
            firstName={user?.name?.split(" ")[0] || "First Name"}
            lastName={user?.name?.split(" ")[1] || "Last Name"}
            email={user?.email || "example@email.com"}
            role={user?.role || "User Role"}
            avatar={user?.avatar || "/user.png"}
            status={user?.status || "OFFLINE"}
            wishlist={user?.wishlist?.length || 0}
            cartItems={user?.cart?.length || 0}
            userId={user?.id || "Guest"}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
