import React from "react";
import Sidebar from "./_components/sidebar/Sidebar";

export default function MessengerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen">
      <Sidebar>{children}</Sidebar>
    </div>
  );
}
