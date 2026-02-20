"use client";

import { ReactNode } from "react";
import VideoChatSidebar from "./_components/VideoChatSidebar";
import { usePathname } from "next/navigation";

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  const pathname = usePathname();
  const isRoom = pathname?.includes("/room/");

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black">
      {!isRoom && <VideoChatSidebar />}
      <div className={`${isRoom ? "ml-0" : "ml-[72px] lg:ml-[240px]"} transition-all duration-300 min-h-screen`}>
        {children}
      </div>
    </main>
  );
};

export default RootLayout;
