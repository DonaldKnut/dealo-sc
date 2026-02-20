"use client";

import useRoutes from "@/hooks/useRoutes";
import MobileItem from "./MobileItem";

const MobileFooter = () => {
  const routes = useRoutes();

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t-[1px] flex justify-between items-center lg:hidden">
      <nav className="flex justify-between w-full px-4 py-2">
        {routes.map((item) => (
          <MobileItem
            key={item.label}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={item.active}
          />
        ))}
      </nav>
    </div>
  );
};

export default MobileFooter;
