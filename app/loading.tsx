"use client";

import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[60%] h-[60%] bg-emerald-500/5 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-[20%] w-[60%] h-[60%] bg-green-500/5 blur-[140px] rounded-full animate-pulse [animation-delay:1.5s]" />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="relative w-24 h-24 border border-emerald-500/30 rounded-2xl flex items-center justify-center">
          <div className="absolute -inset-8 border border-emerald-500/20 rounded-[2rem] border-t-emerald-500/40 animate-spin" style={{ animationDuration: "3s" }} />
          <Image src="/dealo.png" alt="Dealo" width={56} height={56} className="object-contain brightness-0 invert opacity-80" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-[11px] font-black uppercase tracking-widest text-emerald-500">Loading...</p>
          <p className="text-[9px] text-gray-500 uppercase tracking-widest">Initializing</p>
        </div>
      </div>
    </div>
  );
}
