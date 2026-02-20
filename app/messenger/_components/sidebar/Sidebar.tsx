"use client";

import React from "react";

// Legacy messenger sidebar: now reduced to a simple pass-through wrapper.
// The real messenger UI lives in app/messenger/page.tsx.

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Sidebar;
